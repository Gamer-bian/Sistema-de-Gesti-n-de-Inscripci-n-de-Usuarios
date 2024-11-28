const { Builder, By, Key, until } = require('selenium-webdriver');
const fs = require('fs');
const path = require('path');
const assert = require('assert');
const chrome = require('selenium-webdriver/chrome'); // Importar chrome

(async function testSistemaInscripcion() {
    // Crear una instancia del navegador
    let driver = await new Builder()
        .forBrowser('chrome')
        .setChromeService(new chrome.ServiceBuilder("C:\\Users\\admin\\Downloads\\chromedriver-win64\\chromedriver.exe")) // Ruta corregida
        .build();
    
    const screenshotsDir = path.join(__dirname, 'screenshots2');
    const reportFile = path.join(__dirname, 'test_report2.html');
    let reportContent = `
        <html>
        <head>
            <title>Reporte de Pruebas Automatizadas</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; }
                h1 { color: #333; }
                ul { padding-left: 20px; }
                li { margin-bottom: 10px; }
                a { color: blue; text-decoration: none; }
                a:hover { text-decoration: underline; }
            </style>
        </head>
        <body>
            <h1>Resultados de Pruebas Automatizadas</h1>
            <p>Este reporte documenta cada paso de la prueba automatizada ejecutada.</p>
            <ul>
    `;

    // Crear directorio para capturas si no existe
    if (!fs.existsSync(screenshotsDir)) {
        fs.mkdirSync(screenshotsDir);
    }

    // Función para capturar pantalla
    async function takeScreenshot(stepName) {
        const screenshot = await driver.takeScreenshot();
        const filePath = path.join(screenshotsDir, `${stepName}.png`);
        fs.writeFileSync(filePath, screenshot, 'base64');
        reportContent += `<li><strong>${stepName}:</strong> Captura tomada</li>`;
    }

    try {
        // Navegar a la carpeta donde está el index.html
        await driver.get('file:///' + __dirname + '/../index.html');
        await takeScreenshot('01_Navegar a la página de inicio');

        // Intentar iniciar sesión sin registrarse
        await driver.findElement(By.id('btnLogin')).click();
        await driver.sleep(1000); // Esperar para ver el mensaje
        await takeScreenshot('02_Clic en el botón de inicio de sesión');

        // Verificar el mensaje de error de Toastr
        let errorLoginMessage = await driver.findElement(By.css('.toast-error')).getText();
        assert.strictEqual(errorLoginMessage.replace('Error\n', '').trim(), 'Nombre de usuario o contraseña incorrectos');
        reportContent += `<li><strong>Mensaje de error de inicio de sesión:</strong> ${errorLoginMessage}</li>`;

        // Ir al formulario de registro
        await driver.findElement(By.id('btnGoToRegister')).click();
        await driver.sleep(1000); // Esperar para ver el formulario
        await takeScreenshot('03_Ir al formulario de registro');

        // Intentar registrarse sin contraseña
        await driver.findElement(By.id('username')).sendKeys('Martinez Rodriguez');
        await driver.findElement(By.id('btnRegister')).click();
        await driver.sleep(1000); // Esperar para ver el mensaje
        await takeScreenshot('04_Clic en el botón de registro sin contraseña');

        // Verificar que se muestre el mensaje de error
        let errorRegisterMessage = await driver.findElement(By.css('.toast-error')).getText();
        assert.strictEqual(errorRegisterMessage.replace('Error\n', '').trim(), 'Todos los campos son requeridos');
        reportContent += `<li><strong>Mensaje de error de registro:</strong> ${errorRegisterMessage}</li>`;

        // Ahora ingresar la contraseña y registrarse
        await driver.findElement(By.id('password')).sendKeys('martinez08235');
        await driver.findElement(By.id('btnRegister')).click();
        await driver.sleep(1000); // Esperar para ver el mensaje
        await takeScreenshot('05_Clic en el botón de registro con contraseña');

        // Verificar el mensaje de éxito
        let successMessage = await driver.findElement(By.css('.toast-success')).getText();
        assert.strictEqual(successMessage.replace('Éxito\n', '').trim(), 'Cuenta creada exitosamente');
        reportContent += `<li><strong>Mensaje de éxito:</strong> ${successMessage}</li>`;
        await driver.sleep(2000); // Esperar para ver el mensaje

        // Volver al formulario de inicio de sesión
        await driver.findElement(By.id('btnGoToRegister')).click();
        await driver.sleep(1000); // Esperar para ver el formulario
        await takeScreenshot('06_Volver al formulario de inicio de sesión');

        // Intentar registrarse con el mismo nombre de usuario (error de usuario existente)
        await driver.findElement(By.id('username')).sendKeys('Martinez Rodriguez');
        await driver.findElement(By.id('password')).sendKeys('martinez08235');
        await driver.findElement(By.id('btnRegister')).click();
        await driver.sleep(1000); // Esperar para ver el mensaje
        await takeScreenshot('07_Clic en el botón de registro con nombre de usuario existente');

        // Verificar el mensaje de error de usuario ya registrado
        let duplicateUserMessage = await driver.findElement(By.css('.toast-error')).getText();
        assert.strictEqual(duplicateUserMessage.replace('Error\n', '').trim(), 'El nombre de usuario ya está en uso');
        reportContent += `<li><strong>Mensaje de error de usuario existente:</strong> ${duplicateUserMessage}</li>`;

        // Registrar con un segundo nombre de usuario
        await driver.findElement(By.id('username')).clear();
        await driver.findElement(By.id('username')).sendKeys('Pedro Luis Soto');
        await driver.findElement(By.id('btnRegister')).click();
        await driver.sleep(1000); // Esperar para ver el mensaje
        await takeScreenshot('08_Clic en el botón de registro con segundo nombre de usuario');

        // Verificar que el registro con éxito
        let successMessageFinal = await driver.findElement(By.css('.toast-success')).getText();
        assert.strictEqual(successMessageFinal.replace('Éxito\n', '').trim(), 'Cuenta creada exitosamente');
        reportContent += `<li><strong>Mensaje de éxito final:</strong> ${successMessageFinal}</li>`;

    } catch (error) {
        console.error('Error en la prueba:', error);
        reportContent += `<li><strong>Error en la prueba:</strong> ${error.message}</li>`;
    } finally {
        reportContent += '</ul><p>Prueba completada.</p></body></html>';
        fs.writeFileSync(reportFile, reportContent);
        console.log(`Reporte generado: ${reportFile}`);
        // Cerrar el navegador
        await driver.quit();
    }
})();
