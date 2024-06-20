package com.backend.Crawler;

import io.github.bonigarcia.wdm.WebDriverManager;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;
import java.time.Duration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class WebCrawler {
    public Map<String, String> crawler(String keyword) throws UnsupportedEncodingException, InterruptedException {
        Map<String, String> map = new HashMap<>();
        String url = "https://map.naver.com/p/search/" + keyword;


        WebDriverManager.chromedriver().setup();
        WebDriver driver = new ChromeDriver();
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(20)); // 10-second explicit wait

        driver.get(url);
        Thread.sleep(5000);
        driver.switchTo().defaultContent();

        List<WebElement> entryIframes = driver.findElements(By.id("entryIframe"));
        if (entryIframes.size() > 0) {
            // entryIframe이 있으면 해당 프레임으로 전환
            wait.until(ExpectedConditions.frameToBeAvailableAndSwitchToIt("entryIframe"));
            System.out.println("엔트리야~");

            WebElement imgElement = wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector("div.fNygA > a.place_thumb img#ibu_2")));

            String imgSrcValue = imgElement.getAttribute("src");

            System.out.println("이미지의 SRC 속성 값: " + imgSrcValue);

            // 리스트의 첫 번째 요소에 대한 처리를 여기에 추가
        } else {
            // entryIframe이 없으면 searchIframe을 찾음
            wait.until(ExpectedConditions.frameToBeAvailableAndSwitchToIt("searchIframe"));
            System.out.println("서치야~");


            // 'ul > li:first-child > a.place_thumb' 내부의 'img' 태그를 찾음
            WebElement imgElement = wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector("ul > li:first-child a.place_thumb img")));

// 'img' 태그의 'src' 속성 값을 가져옴
            String imgSrcValue = imgElement.getAttribute("src");

            System.out.println("이미지의 SRC 속성 값: " + imgSrcValue);


            // searchIframe 내부에서 첫 번째 li 요소 안의 a 태그를 찾음
//            WebElement firstLiLink = wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector("ul > li:first-child a.P7gyV")));
//
//            //찾은 태그 클릭
//            firstLiLink.click();


//            // 'CHC5F' 클래스를 가진 div 요소를 찾음
//            WebElement parentDiv = driver.findElement(By.className("CHC5F"));
//
//// 'MVx6e' 클래스를 가진 div 내의 세 번째 span 요소의 텍스트를 가져옴
//            WebElement thirdSpan = parentDiv.findElement(By.cssSelector("div.MVx6e span:nth-child(3)"));
//            String thirdSpanText = thirdSpan.getText();
//
//// 'CHC5F' 클래스를 가진 div 내의 'place_bluelink' 클래스를 가진 span 요소의 텍스트를 가져옴
//            WebElement blueLinkSpan = parentDiv.findElement(By.cssSelector("span.place_bluelink"));
//            String blueLinkText = blueLinkSpan.getText();
//
//            System.out.println("세 번째 span의 텍스트: " + thirdSpanText);
//            System.out.println("'place_bluelink' 클래스를 가진 span의 텍스트: " + blueLinkText);
//
//            map.put("span", thirdSpanText);
//            map.put("blueLink", blueLinkText);
        }


        driver.quit();
        return map;
    }
}
