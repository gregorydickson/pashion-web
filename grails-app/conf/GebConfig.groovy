import org.openqa.selenium.htmlunit.HtmlUnitDriver
import com.gargoylesoftware.htmlunit.BrowserVersion
import com.gargoylesoftware.htmlunit.ThreadedRefreshHandler

System.setProperty('webdriver.chrome.driver', '/usr/local/bin/chromedriver')

driver = 'chrome' //could be one of: chrome, firefox, ie, htmlunit with its default config
/*
driver = {
	//htmlUnit needs some config that isn't by default
	BrowserVersion.setDefault(BrowserVersion.CHROME)
	def driverInstance = new HtmlUnitDriver(true)
	driverInstance.webClient.refreshHandler = new ThreadedRefreshHandler()
	driverInstance
}
*/
// if we want to use Geb with multiple threads at the same time,
// then instruct Geb to cache the driver instance per thread,
// but remember to call browser.quit() at the end of that thread/job
cacheDriverPerThread = true

// defaults wait for up to 1 minute, waiting 5 second in between retries
waiting {
    timeout = 1 * 60
    retryInterval = 5
}

atCheckWaiting = true
baseNavigatorWaiting = true
