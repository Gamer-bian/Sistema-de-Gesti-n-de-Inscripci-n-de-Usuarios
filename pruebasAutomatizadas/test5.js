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
    
    const screenshotsDir = path.join(__dirname, 'screenshots5');
    const reportFile = path.join(__dirname, 'test_report5.html');
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
        await driver.sleep(2000); // Esperar para ver el mensaje
        await takeScreenshot('02_Clic en el botón de inicio de sesión');

        // Verificar el mensaje de error de Toastr
        let errorLoginMessage = await driver.findElement(By.css('.toast-error')).getText();
        assert.strictEqual(errorLoginMessage.replace('Error\n', '').trim(), 'Nombre de usuario o contraseña incorrectos');
        reportContent += `<li><strong>Mensaje de error de inicio de sesión:</strong> ${errorLoginMessage}</li>`;

        // Ir al formulario de registro
        await driver.findElement(By.id('btnGoToRegister')).click();
        await driver.sleep(2000); // Esperar para ver el formulario
        await takeScreenshot('03_Ir al formulario de registro');

        // Intentar registrarse sin contraseña
        await driver.findElement(By.id('username')).sendKeys('Pedro Luis');
        await driver.findElement(By.id('btnRegister')).click();
        await driver.sleep(2000); // Esperar para ver el mensaje
        await takeScreenshot('04_Clic en el botón de registro sin contraseña');

        // Verificar que se muestre el mensaje de error
        let errorRegisterMessage = await driver.findElement(By.css('.toast-error')).getText();
        assert.strictEqual(errorRegisterMessage.replace('Error\n', '').trim(), 'Todos los campos son requeridos');
        reportContent += `<li><strong>Mensaje de error de registro:</strong> ${errorRegisterMessage}</li>`;

        // Ahora ingresar la contraseña y registrarse
        await driver.findElement(By.id('password')).sendKeys('pedroLuis1234');
        await driver.findElement(By.id('btnRegister')).click();
        await driver.sleep(2000); // Esperar para ver el mensaje
        await takeScreenshot('05_Clic en el botón de registro con contraseña');

        // Verificar el mensaje de éxito
        let successMessage = await driver.findElement(By.css('.toast-success')).getText();
        assert.strictEqual(successMessage.replace('Éxito\n', '').trim(), 'Cuenta creada exitosamente');
        reportContent += `<li><strong>Mensaje de éxito:</strong> ${successMessage}</li>`;
        await driver.sleep(2000); // Esperar para ver el mensaje

        // Intentar iniciar sesión con contraseña incorrecta
        await driver.findElement(By.id('loginUsername')).sendKeys('Pedro Luis');
        await driver.findElement(By.id('loginPassword')).sendKeys('PedroLuis123456');
        await driver.findElement(By.id('btnLogin')).click();
        await driver.sleep(2000); // Esperar para ver el mensaje
        await takeScreenshot('06_Iniciar sesión con contraseña incorrecta');

        // Verificar el mensaje de error
        errorLoginMessage = await driver.findElement(By.css('.toast-error')).getText();
        assert.strictEqual(errorLoginMessage.replace('Error\n', '').trim(), 'Nombre de usuario o contraseña incorrectos');
        reportContent += `<li><strong>Mensaje de error al iniciar sesión:</strong> ${errorLoginMessage}</li>`;

        // Iniciar sesión con la contraseña correcta
        await driver.findElement(By.id('loginPassword')).clear();
        await driver.findElement(By.id('loginPassword')).sendKeys('pedroLuis1234');
        await driver.findElement(By.id('btnLogin')).click();
        await driver.sleep(2000); // Esperar para ver el mensaje
        await takeScreenshot('07_Iniciar sesión con contraseña correcta');

        // Verificar el mensaje de éxito
        successMessage = await driver.findElement(By.css('.toast-success')).getText();
        assert.strictEqual(successMessage.replace('Éxito\n', '').trim(), 'Inicio de sesión exitoso');
        reportContent += `<li><strong>Mensaje de éxito al iniciar sesión:</strong> ${successMessage}</li>`;

        // Completar el formulario de datos personales
        await driver.findElement(By.id('nombre')).sendKeys('Juan');
        await driver.findElement(By.id('provincia')).sendKeys('Provincia1');
        await driver.findElement(By.id('ciudad')).sendKeys(''); // Dejar ciudad vacío
        await driver.findElement(By.id('sector')).sendKeys('Sector1');
        await driver.findElement(By.id('calle')).sendKeys('Calle1');
        await driver.findElement(By.id('carrera')).sendKeys('software'); // Seleccionar carrera
        await driver.findElement(By.id('btnNext')).click();
        await driver.sleep(2000); // Esperar para ver el mensaje
        await takeScreenshot('08_Clic en el botón de siguiente sin ciudad');

        // Verificar el mensaje de error por campo requerido
        let errorDataMessage = await driver.findElement(By.css('.toast-error')).getText();
        assert.strictEqual(errorDataMessage.replace('Error\n', '').trim(), 'Oups ha ocurrido un error\nToda la información es requerida');
        reportContent += `<li><strong>Mensaje de error en datos personales:</strong> ${errorDataMessage}</li>`;

        // Completar el campo de ciudad
        await driver.findElement(By.id('ciudad')).sendKeys('Ciudad1');
        await driver.findElement(By.id('btnNext')).click();
        await driver.sleep(2000); // Esperar para ver el mensaje
        await takeScreenshot('09_Clic en el botón de siguiente con ciudad');

        // Verificar el mensaje de éxito
        let successDataMessage = await driver.findElement(By.css('.toast-success')).getText();
        assert.strictEqual(successDataMessage.replace('Éxito\n', '').trim(), 'Enviado\nFormulario enviado correctamente');
        reportContent += `<li><strong>Mensaje de éxito en datos personales:</strong> ${successDataMessage}</li>`;
        await driver.sleep(3000); // Esperar para ver el mensaje

        // Seleccionar materias
        await driver.sleep(3000); // Esperar para que se cargue el formulario de selección de materias
        await takeScreenshot('10_Cargar formulario de selección de materias');

        // Seleccionar horarios específicos para cada materia
        const horarios = [
            'horario1_1', // Lunes
            'horario2_2', // Martes
            'horario3_3', // Miércoles
            'horario4_4', // Jueves
            'horario5_5'  // Viernes
        ];

        // Seleccionar todos los horarios
        for (let i = 0; i < horarios.length; i++) {
            await driver.findElement(By.id(horarios[i])).click(); // Seleccionar el horario correspondiente
            await driver.sleep(1000); // Esperar un poco para la acción
        }

        // Hacer clic en el botón de registrar
        await driver.findElement(By.id('formSecond__Registrar')).click(); 
        await driver.sleep(2000); // Esperar para ver el mensaje
        await takeScreenshot('11_Clic en el botón de registrar con todas las materias');

        // Esperar a que se muestre el siguiente formulario
        await driver.sleep(3000); // Esperar para ver el siguiente formulario

        // Si deseas verificar el mensaje de éxito, puedes agregarlo aquí
        let successMateriasMessage = await driver.findElement(By.css('.toast-success')).getText();
        reportContent += `<li><strong>Mensaje de éxito en selección de materias:</strong> ${successMateriasMessage}</li>`;

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
