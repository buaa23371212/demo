const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

// 配置参数（根据实际情况修改）
const config = {
    url: 'http://182.92.100.66:9000/login',  // 测试网址
    studentId: '23371212',                  // 替换为你的实际学号
    timeout: 5000                           // 等待超时时间(毫秒)
};

(async function loginTest() {
    // 1. 创建浏览器实例 (Chrome)
    let driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(new chrome.Options())
        .build();

    try {
        // 2. 打开登录页面
        console.log(`打开登录页面: ${config.url}`);
        await driver.get(config.url);

        // 3. 输入学号 (使用 By.name 定位)
        const studentIdInput = await driver.findElement(By.name('student-id'));
        console.log('找到学号输入框');
        await studentIdInput.sendKeys(config.studentId);

        // 4. 点击登录按钮 (使用 By.css 定位 button)
        const loginButton = await driver.findElement(By.css('button[type="button"]'));
        console.log('找到登录按钮');
        await loginButton.click();

        // 5. 等待消息元素出现 (使用 By.id 定位)
        console.log('等待消息加载...');
        const messageElement = await driver.wait(
            until.elementLocated(By.id('message')),
            config.timeout
        );

        // 6. 获取消息文本
        const actualMessage = await messageElement.getText();
        const expectedMessage = `hello, ${config.studentId}`;
        console.log(`实际消息: "${actualMessage}"`);
        console.log(`预期消息: "${expectedMessage}"`);

        // 7. 验证消息内容
        if (actualMessage === expectedMessage) {
            console.log('✅ 测试通过: 消息内容匹配');
        } else {
            console.error('❌ 测试失败: 消息内容不匹配');
            throw new Error(`消息验证失败: 预期 "${expectedMessage}" 但获取到 "${actualMessage}"`);
        }

    } catch (error) {
        console.error('❌ 测试执行出错:', error.message);
    } finally {
        // 8. 关闭浏览器 (无论测试是否成功)
        console.log('关闭浏览器...');
        await driver.quit();
    }
})();