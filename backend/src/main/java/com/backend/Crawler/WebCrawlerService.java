package com.backend.Crawler;

import com.backend.domain.place.Place;
import com.backend.mapper.place.PlaceMapper;
import io.github.bonigarcia.wdm.WebDriverManager;
import lombok.RequiredArgsConstructor;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
public class WebCrawlerService {

    private final PlaceMapper placeMapper;
    private final WebrawlerMapper webrawlerMapper;

    public Map<String, Map<String, String>> imageCrawling(List<Place> places) throws InterruptedException {
        ExecutorService executorService = Executors.newFixedThreadPool(10);
        Map<String, Map<String, String>> map = new ConcurrentHashMap<>();

        for (Place place : places) {
            executorService.submit(() -> {
                String src = webrawlerMapper.selectImage(place.getPlaceName());
                if (src != null) {
                    Map<String, String> keyValue = new HashMap<>();
                    keyValue.put("src", src);
                    map.put(place.getPlaceName(), keyValue);
                } else {
                    Map<String, String> keyValue = new HashMap<>();
                    String url = "https://map.naver.com/p/search/" + place.getAddress() + " " + place.getPlaceName();
                    String picUrl = "";
                    System.out.println(url);

//                ChromeOptions options = new ChromeOptions();
//                options.addArguments("headless"); // 머리 없는 모드 활성화
                    WebDriverManager.chromedriver().setup();
                    WebDriver driver = new ChromeDriver();
                    WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(20));

                    try {
                        driver.get(url);
                        Thread.sleep(2000);

                        driver.switchTo().defaultContent();
                        List<WebElement> entryIframes = driver.findElements(By.id("entryIframe"));

                        if (!entryIframes.isEmpty()) {
                            // entryIframe이 있으면 해당 프레임으로 전환
                            wait.until(ExpectedConditions.frameToBeAvailableAndSwitchToIt("entryIframe"));
                            System.out.println("엔트리야~");

                            WebElement imgElement = wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector("div.fNygA > a.place_thumb img")));
                            String imgSrcValue = imgElement.getAttribute("src");

                            // 썸네일 이미지 URL 수정
                            String updatedUrl = imgSrcValue.replaceAll("\\?.*?&src=", "?src=");
                            picUrl = updatedUrl;
                            System.out.println("이미지의 SRC 속성 값: " + updatedUrl);

                            keyValue.put("src", updatedUrl);
                            map.put(place.getPlaceName(), keyValue);
                        } else {
                            List<WebElement> searchIframes = driver.findElements(By.id("searchIframe"));

                            if (!searchIframes.isEmpty()) {
                                // searchIframe이 있으면 해당 프레임으로 전환
                                wait.until(ExpectedConditions.frameToBeAvailableAndSwitchToIt("searchIframe"));
                                System.out.println("서치야~");

                                WebElement imgElement = wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector("ul > li:first-child a.place_thumb img")));
                                String imgSrcValue = imgElement.getAttribute("src");
                                String updatedUrl = imgSrcValue.replaceAll("\\?.*?&src=", "?src=");
                                picUrl = updatedUrl;
                                System.out.println("이미지의 SRC 속성 값: " + updatedUrl);

                                keyValue.put("src", updatedUrl);
                                map.put(place.getPlaceName(), keyValue);
                            } else {
                                // entryIframe과 searchIframe이 모두 없고 title 태그가 존재하는 경우
                                List<WebElement> titleElements = driver.findElements(By.cssSelector("div.title_box.no_ellipsis > strong.title"));
                                if (!titleElements.isEmpty()) {
                                    System.out.println("타이틀이야~");
                                    String fallbackUrl = "https://map.naver.com/p/search/" + place.getPlaceName();
                                    System.out.println(fallbackUrl);

                                    driver.get(fallbackUrl);
                                    Thread.sleep(2000);
                                    driver.switchTo().defaultContent();

                                    entryIframes = driver.findElements(By.id("entryIframe"));
                                    if (!entryIframes.isEmpty()) {
                                        wait.until(ExpectedConditions.frameToBeAvailableAndSwitchToIt("entryIframe"));
                                        WebElement imgElement = wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector("div.fNygA > a.place_thumb img")));
                                        String imgSrcValue = imgElement.getAttribute("src");
                                        String updatedUrl = imgSrcValue.replaceAll("\\?.*?&src=", "?src=");
                                        picUrl = updatedUrl;
                                        System.out.println("이미지의 SRC 속성 값: " + updatedUrl);

                                        keyValue.put("src", updatedUrl);
                                        map.put(place.getPlaceName(), keyValue);
                                    } else {
                                        searchIframes = driver.findElements(By.id("searchIframe"));
                                        if (!searchIframes.isEmpty()) {
                                            wait.until(ExpectedConditions.frameToBeAvailableAndSwitchToIt("searchIframe"));
                                            WebElement imgElement = wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector("ul > li:first-child a.place_thumb img")));
                                            String imgSrcValue = imgElement.getAttribute("src");
                                            String updatedUrl = imgSrcValue.replaceAll("\\?.*?&src=", "?src=");
                                            picUrl = updatedUrl;
                                            System.out.println("이미지의 SRC 속성 값: " + updatedUrl);

                                            keyValue.put("src", updatedUrl);
                                            map.put(place.getPlaceName(), keyValue);
                                        }
                                    }
                                }
                            }
                        }
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    } finally {
                        driver.quit();
                    }

                    placeMapper.insertPlacePicture(place.getPlaceId(), place.getPlaceName(), picUrl);
                }
            });
        }

        executorService.shutdown();
        try {
            if (!executorService.awaitTermination(20, TimeUnit.SECONDS)) {
                executorService.shutdownNow();
            }
        } catch (InterruptedException e) {
            executorService.shutdownNow();
        }

        return map;
    }


}
