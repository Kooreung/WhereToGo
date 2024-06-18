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
import java.util.Map;

@Service
public class WebCrawler {
    public Map<String, String> crawler(String keyword) throws UnsupportedEncodingException {
        Map<String, String> map = new HashMap<>();
        String url = "https://map.naver.com/p/search/" + "역삼동 618-11" + " 알베르";


        WebDriverManager.chromedriver().setup();
        WebDriver driver = new ChromeDriver();
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(20)); // 10-second explicit wait

        driver.get(url);

        driver.switchTo().defaultContent();
        wait.until(ExpectedConditions.frameToBeAvailableAndSwitchToIt("searchIframe"));

//        System.setOut(new PrintStream(System.out, true, "UTF-8"));

        // 'CHC5F' 클래스를 가진 div 요소를 찾음
        WebElement parentDiv = driver.findElement(By.className("CHC5F"));

// 'MVx6e' 클래스를 가진 div 내의 세 번째 span 요소의 텍스트를 가져옴
        WebElement thirdSpan = parentDiv.findElement(By.cssSelector("div.MVx6e span:nth-child(3)"));
        String thirdSpanText = thirdSpan.getText();

// 'CHC5F' 클래스를 가진 div 내의 'place_bluelink' 클래스를 가진 span 요소의 텍스트를 가져옴
        WebElement blueLinkSpan = parentDiv.findElement(By.cssSelector("span.place_bluelink"));
        String blueLinkText = blueLinkSpan.getText();

        System.out.println("세 번째 span의 텍스트: " + thirdSpanText);
        System.out.println("'place_bluelink' 클래스를 가진 span의 텍스트: " + blueLinkText);

        map.put("span", thirdSpanText);
        map.put("blueLink", blueLinkText);

        driver.quit();
        return map;
    }
}
