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


    public Map<String, Map<String, String>> crawler(List<Place> places) throws InterruptedException {
        ExecutorService executorService = Executors.newFixedThreadPool(10);
        Map<String, Map<String, String>> map = new ConcurrentHashMap<>();


        for (Place place : places) {
            executorService.submit(() -> {
                Map<String, String> keyValue = new HashMap<>();
                String url = "https://map.naver.com/p/search/" + place.getAddress() + " " + place.getPlaceName();
                String picUrl = "";
                System.out.println(url);


                WebDriverManager.chromedriver().setup();
                WebDriver driver = new ChromeDriver();
                WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(20)); // 10-second explicit wait

                driver.get(url);
                try {
                    Thread.sleep(2000);
                } catch (InterruptedException e) {
                    throw new RuntimeException(e);
                }

                driver.switchTo().defaultContent();


                List<WebElement> entryIframes = driver.findElements(By.id("entryIframe"));


                if (entryIframes.size() > 0) {
                    // entryIframe이 있으면 해당 프레임으로 전환
                    wait.until(ExpectedConditions.frameToBeAvailableAndSwitchToIt("entryIframe"));
                    System.out.println("엔트리야~");


                    WebElement imgElement = wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector("div.fNygA > a.place_thumb img")));

                    String imgSrcValue = imgElement.getAttribute("src");

                    // 기존 src주소의 경우 썸네일에 사용하기 위해 사진의 크기가 조절되어 저장됨
                    // 때문에 "https://search.pstatic.net/common/?autoRotate=true&type=w560_sharpen&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20200117_10%2F1579266380177M2JLY_JPEG%2FkCWopnX-fm4IDubRsf0g9Goa.jpg";
                    //기존 주소에서 autoRotate=true&type=w560_sharpen& 부분을 삭제해 기존의 사진 크기로 나오게 저장
                    String updatedUrl = imgSrcValue.replaceAll("\\?.*?&src=", "?src=");
                    picUrl = updatedUrl;
                    System.out.println("이미지의 SRC 속성 값: " + updatedUrl);

                    keyValue.put("src", updatedUrl);
                    map.put(place.getPlaceName(), keyValue);

                    driver.quit();
                    // 리스트의 첫 번째 요소에 대한 처리를 여기에 추가
                } else {
                    // entryIframe이 없으면 searchIframe을 찾음
                    wait.until(ExpectedConditions.frameToBeAvailableAndSwitchToIt("searchIframe"));
                    System.out.println("서치야~");


                    // 'ul > li:first-child > a.place_thumb' 내부의 'img' 태그를 찾음
                    WebElement imgElement = wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector("ul > li:first-child a.place_thumb img")));

// 'img' 태그의 'src' 속성 값을 가져옴
                    String imgSrcValue = imgElement.getAttribute("src");
                    String updatedUrl = imgSrcValue.replaceAll("\\?.*?&src=", "?src=");
                    picUrl = updatedUrl;
                    System.out.println("이미지의 SRC 속성 값: " + updatedUrl);

                    keyValue.put("src", updatedUrl);
                    map.put(place.getPlaceName(), keyValue);

                    driver.quit();
                }
                placeMapper.insertPlacePicture(place.getPlaceId(), place.getPlaceName(), picUrl);
            });

        }
        executorService.shutdown(); // 스레드 풀 종료 명령
        try {
            if (!executorService.awaitTermination(20, TimeUnit.SECONDS)) {
                executorService.shutdownNow();// 모든 작업이 완료되지 않았다면 강제 종료
                return map;
            }
        } catch (InterruptedException e) {
            executorService.shutdownNow();
            return map;
        }

        return map;
    }


}
