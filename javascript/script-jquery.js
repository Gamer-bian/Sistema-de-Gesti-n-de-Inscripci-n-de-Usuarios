// Definiendo las variables globales
const $firstForm = $('#firstForm');
const $formSecond = $('#formsecond');
const $threeForm = $('#threeForm');
const $inputName = $('#nombre');
const $inputProvincia = $('#provincia');
const $inputCiudad = $('#ciudad');
const $inputSector = $('#sector');
const $inputCalle = $('#calle');
const $inputCarrera = $('#carrera');
const $containerForm = $('#container__form');
const $infoBasic = $('#threeForm__informacion-basica');
const $registerContainer = $('#registerContainer');
const $loginContainer = $('#loginContainer');
const $formEditarHorario = $('#formEditarHorario');
const $recoverContainer = $('#recoverContainer');
const $loginForm = $('#loginForm');
const $recoverPasswordForm = $('#recoverPasswordForm');

// Almacenamos usuarios en un array (puedes usar una base de datos en un proyecto real)
let users = [];
// Funciones de validación de los formularios
function validateInput(input) {
    const valueInput = input.val();
    if (valueInput === "" || valueInput === null || valueInput === undefined) {
        input.css('outline', '3px solid #f00'); // Rojo si está vacío
        return false;
    } else {
        input.css('outline', '3px solid #0f0'); // Verde si está correcto
        return true;
    }

}

function resetInput(input) {
    input.css('outline', 'none'); // Resetear el color
}

// Función para registrar un nuevo usuario
$('#btnRegister').on('click', function() {
    const username = $('#username');
    const password = $('#password');

    const isUsernameValid = validateInput(username);
    const isPasswordValid = validateInput(password);

    if (!isUsernameValid || !isPasswordValid) {
        toastr.error("Todos los campos son requeridos", "Error");
        return;
    }

    // Verificar si el usuario ya existe
    if (users.some(user => user.username === username.val())) {
        toastr.error("El nombre de usuario ya está en uso", "Error");
        username.css('outline', '3px solid #f00'); // Rojo si el usuario ya existe
        return;
    }

    // Agregar el nuevo usuario
    users.push({ username: username.val(), password: password.val() });
    toastr.success("Cuenta creada exitosamente", "Éxito");
    $registerContainer[0].reset();
    resetInput(username); // Resetear el color
    resetInput(password); // Resetear el color
    $registerContainer.parent().removeClass("d-flex").addClass('d-none');
    $loginContainer.parent().removeClass("d-none").addClass('d-flex');
});

// Función para iniciar sesión
$('#btnLogin').on('click', function() {
    const loginUsername = $('#loginUsername');
    const loginPassword = $('#loginPassword');

    const user = users.find(user => user.username === loginUsername.val() && user.password === loginPassword.val());

    if (user) {
        toastr.success("Inicio de sesión exitoso", "Éxito");
        // Aquí puedes redirigir al usuario al formulario principal
        $loginContainer[0].reset();
        resetInput(loginUsername); // Resetear el color
        resetInput(loginPassword); // Resetear el color
        $loginContainer.parent().removeClass("d-flex").addClass('d-none');
        $firstForm.removeClass("d-none").addClass("d-flex");
    } else {
        toastr.error("Nombre de usuario o contraseña incorrectos", "Error");
        loginUsername.css('outline', '3px solid #f00'); // Rojo si el usuario es incorrecto
        loginPassword.css('outline', '3px solid #f00'); // Rojo si la contraseña es incorrecta
    }
});

// Función para ir al formulario de registro
$('#btnGoToRegister').on('click', function() {
    // Limpiar el formulario de inicio de sesión
    $('#loginContainer')[0].reset();
    resetInput($('#loginUsername')); // Resetear el color
    resetInput($('#loginPassword')); // Resetear el color

    $loginContainer.parent().removeClass("d-flex").addClass('d-none');
    $registerContainer.parent().removeClass("d-none").addClass('d-flex');
});
        
    // Función para ir al formulario de recuperación de contraseña
    $('#btnRecoverPassword').on('click', function() {    // Limpiar el formulario de inicio de sesión
        $('#loginContainer')[0].reset();
        resetInput($('#loginUsername')); // Resetear el color
        resetInput($('#loginPassword')); // Resetear el color

        $loginContainer.parent().removeClass("d-flex").addClass('d-none');
        $recoverPasswordForm.removeClass("d-none").addClass('d-flex');
    });

    // Función para volver al formulario de inicio de sesión
    $('#btnBackToLogin').on('click', function() {
        $recoverPasswordForm.removeClass("d-flex").addClass('d-none');
        $loginContainer.parent().removeClass("d-none").addClass('d-flex');
    });

    // Función para recuperar la contraseña
    $('#btnRecover').on('click', function() {
        const recoverUsername = $('#recoverUsername');
        const usernameValue = recoverUsername.val();
        const user = users.find(user => user.username === usernameValue);

        if (validateInput(recoverUsername)) {
            if (user) {
                // Mostrar la contraseña debajo del input
                $('#passwordMessage').removeClass('d-none').text(`Tu contraseña es: ${user.password}`);
                recoverUsername.css('outline', 'none'); // Resetear el color
            } else {
                // Mostrar mensaje de error si el usuario no existe
                toastr.error("El nombre de usuario no existe", "Error");
                recoverUsername.css('outline', '3px solid #f00'); // Rojo si el usuario no existe
                $('#passwordMessage').addClass('d-none'); // Ocultar el mensaje de contraseña
            }
        } else {
            toastr.error("Por favor, ingresa tu nombre de usuario", "Error");
        }
    });

//creando los objetos con listas que se estaran utilizando en el segundo formulario
const materiasPorCarrera = {
    software: [
        "Programación I",
        "Estructuras de Datos",
        "Bases de Datos",
        "Desarrollo Web",
        "Algoritmos"
    ],
    multimedia: [
        "Diseño Gráfico",
        "Producción Multimedia",
        "Animación Digital",
        "Desarrollo de Videojuegos",
        "Edición de Video"
    ],
    redes: [
        "Redes de Computadoras",
        "Seguridad Informática",
        "Administración de Servidores",
        "Telecomunicaciones",
        "IoT"
    ]
};

// funcion para detectar cual carrera se eligio en el select 
$inputCarrera.on('change', function() {
    const selectedCarrera = $(this).val();
    const $materiasDiv = $('#materias');
    $materiasDiv.empty(); // Limpiar materias anteriores

    if (selectedCarrera) {
        materiasPorCarrera[selectedCarrera].forEach((materia, index) => {
            const $col = $(`
                <div class="col-md-6 mb-4">
                    <div class="materia unica-materia">
                        <h4>${materia}</h4>
                        <div class="materia_horario unica-horario">
                            <input type="radio" name="horario${index + 1}" id="horario${index + 1}_1" value="L (8:00am a 12:00pm)">
                            <label for="horario${index + 1}_1">Lu (8:00am a 12:00pm)</label>
                        </div>
                        <div class="materia_horario unica-horario">
                            <input type="radio" name="horario${index + 1}" id="horario${index + 1}_2" value="K (2:00pm a 6:00pm)">
                            <label for="horario${index + 1}_2">K (2:00pm a 6:00pm)</label>
                        </div>
                        <div class="materia_horario unica-horario">
                            <input type="radio" name="horario${index + 1}" id="horario${index + 1}_3" value="M (8:00am a 12:00pm)">
                            <label for="horario${index + 1}_3">M (8:00am a 12:00pm)</label>
                        </div>
                        <div class="materia_horario unica-horario">
                            <input type="radio" name="horario${index + 1}" id="horario${index + 1}_4" value="J (2:00pm a 6:00pm)">
                            <label for="horario${index + 1}_4">J (2:00pm a 6:00pm)</label>
                        </div>
                        <div class="materia_horario unica-horario">
                            <input type="radio" name="horario${index + 1}" id="horario${index + 1}_5" value="V (7:00am a 10:00pm)">
                            <label for="horario${index + 1}_5">V (7:00am a 10:00pm)</label>
                        </div>
                    </div>
                </div>

            `);
            $materiasDiv.append($col);
        });
    }
});

// funciones de validacion de los formularios
function value(input) {
    const valueInput = input.val();
    if (valueInput === "" || valueInput === null || valueInput === undefined) {
        input.css('outline', '3px solid #f00');
        return false;
    } else {
        input.css('outline', '3px solid #0f0');
        return true;
    }
}

function valueNot(input) {
    const valueInput = input.val();
    if (valueInput === "" || valueInput === null || valueInput === undefined) {
        input.css('outline', 'none');
        return false;
    } else {
        input.css('outline', 'none');
        return true;
    }
}

// funcion de el boton de siguiente en el primer formulario
$('#btnNext').on('click', function(event) {
    event.preventDefault();
    const selectedCarrera = $inputCarrera.val();

    let allValue = true;
    allValue = value($inputName) && allValue;
    allValue = value($inputProvincia) && allValue;
    allValue = value($inputCiudad) && allValue;
    allValue = value($inputSector) && allValue;
    allValue = value($inputCalle) && allValue;
    allValue = value($inputCarrera) && allValue;

    if (!allValue) {
        toastr.error("Toda la información es requerida", "Oups ha ocurrido un error");
    } else {
        toastr.success("Formulario enviado correctamente", "Enviado");
        // Asignar las materias a la tabla
        materiasPorCarrera[selectedCarrera].forEach((materia, index) => {
            $(`#materia${index + 1}`).text(materia);
        });

        $firstForm.addClass("d-none").removeClass("d-flex");
        $formSecond.removeClass("d-none");
    }
});

//boton de ir hacia atras del primer formulario
$('#formSecond__atras').on('click', function() {
    $firstForm.removeClass("d-none").addClass("d-flex");
    $formSecond.addClass("d-none");
});

// function para validar los inputs de tipo radio del segundo formulario
function validarRadios() {
    let allSelected = true; 

    for (let i = 1; i <= 5; i++) { 
        const selectedRadio = $(`input[name="horario${i}"]:checked`);
        const $tituloMateria = $(`#materia${i}`);

        if (selectedRadio.length) {
            $tituloMateria.css('color', '#000');
        } else {
            $tituloMateria.css('color', '#000'); 
            allSelected = false; 
        }
    }

    return allSelected; 
}

// funcion del segundo formulario para ir al siguiente formulario
$('#formSecond__Registrar').on('click', function() {
    for (let i = 1; i <= 5; i++) { 
        const $fila = $(`#filaMaterias${i}`);
        const $celdas = $fila.find('td');
        $celdas.slice(1).text(''); 
    }
    const allSelected = validarRadios();

    if (!allSelected) {
        toastr.error("Deben estar todos los campos llenos", "Error");
        return; 
    }

    for (let i = 1; i <= 5; i++) {
        const selectedRadio = $(`input[name="horario${i}"]:checked`);
        const dia = selectedRadio.val().charAt(0); 
        const hora = selectedRadio.val(); 

        let diaIndex;
        switch (dia) {
            case 'L':
                diaIndex = 1;
                break;
            case 'K':
                diaIndex = 2;
                break;
            case 'M':
                diaIndex = 3; 
                break;
            case 'J':
                diaIndex = 4; 
                break;
            case 'V':
                diaIndex = 5;
                break;
        }

        const $fila = $(`#filaMaterias${i}`);
        $fila.find('td').eq(diaIndex).text(hora); 
    }

    // Si todo está correcto, mostrara el mensaje de enviado y creara el tercer formulario (2)
    toastr.success("Formulario enviado correctamente", "Enviado");
    $formSecond.addClass("d-none");
    $threeForm.removeClass("d-none").addClass("d-flex");
    $formEditarHorario.removeClass("d-none").addClass("d-block");

    $infoBasic.html(`
        <div class="container mt-5 info-basica"">
            <h2 class="p-2 text-center">Información Básica</h2>
            <ul class="list-group mt-3">
                <li class="list-group-item">Nombre: ${$inputName.val()}</li>
                <li class="list-group-item">Provincia:  ${$inputProvincia.val()}</li>
                <li class="list-group-item">Ciudad:  ${$inputCiudad.val()}</li>
                <li class="list-group-item">Sector:  ${$inputSector.val()}</li>
                <li class="list-group-item">Calle:  ${$inputCalle.val()}</li>
                <li class="list-group-item">Carrera:  ${$inputCarrera.val()}</li>
            </ul>
        </div>
    `);
});

$(document).ready(function() {
    $('#formThree__Registrar').on('click', function() {
        // Mostrar el modal
        $('#confirmModal').modal('show');
    });

    $('#confirmSubmit').on('click', function() {
        toastr.success("Formulario enviado correctamente", "Enviado");
        
        $loginContainer.parent().removeClass("d-none").addClass("d-flex");
        $threeForm.addClass("d-none").removeClass("d-flex");
        $formEditarHorario.addClass("d-none").removeClass("d-block");

        $containerForm[0].reset();
        valueNot($inputName);
        valueNot($inputProvincia);
        valueNot($inputCiudad);
        valueNot($inputSector);
        valueNot($inputCalle);
        valueNot($inputCarrera);
        
        $inputName.focus(); 

        $('#confirmModal').modal('hide');
    });
});
 

$('#formThree__atras').on('click', function() {
    $formSecond.removeClass("d-none");
    $threeForm.addClass("d-none").removeClass("d-flex");
    $formEditarHorario.addClass("d-none").removeClass("d-block");
});

$('#btnClean').on('click', function(event) {
    event.preventDefault();
    $containerForm[0].reset();
    valueNot($inputName);
    valueNot($inputProvincia);
    valueNot($inputCiudad);
    valueNot($inputSector);
    valueNot($inputCalle);
    valueNot($inputCarrera);

    $inputName.focus();
});

$(document).ready(function () {
    // Botón para guardar cambios
    $('#guardarHorario').click(function () {
        const dia = $('#diaHorario').val(); // Día seleccionado
        const materia = $('#materiaHorario').val(); // Materia ingresada
        const nuevaHora = $('#nuevaHora').val(); // Nueva hora ingresada (formato: M (8:00am a 12:00pm))

        if (!materia || !nuevaHora) {
            // Mostrar mensaje de error con toastr
            toastr.error("Deben estar todos los campos llenos", "Error");
            return;
        }

        // Validación del formato de hora
        const horaRegex = /^[A-Za-z]+ \(\d{1,2}(:\d{2})?(am|pm) a \d{1,2}(:\d{2})?(am|pm)\)$/;
        if (!horaRegex.test(nuevaHora)) {
            // Mostrar mensaje de error con toastr
            toastr.error("Por favor, ingresa la hora en el formato correcto: M (8:00am a 12:00pm).", "Error");
            return;
        }

        // Asocia columnas con los días
        const columnasDias = {
            lunes: 1,
            martes: 2,
            miercoles: 3,
            jueves: 4,
            viernes: 5
        };

        // Selecciona la columna correspondiente
        const columnaIndex = columnasDias[dia];
        const fila = $(`#tablaHorarios tbody tr:has(td:contains("${materia}"))`);

        if (fila.length > 0) {
            // Edita el horario en el formato especificado
            fila.find(`td:eq(${columnaIndex})`).text(nuevaHora).css({
                "background-color": "#80DEEA",
                "color": "#006064"
            });

            // Mostrar mensaje de éxito con toastr
            toastr.success("Horario actualizado correctamente.", "Éxito");
        } else {
            // Mostrar mensaje de error con toastr
            toastr.error("Materia no encontrada en la tabla.", "Error");
        }
    });
});

$(document).ready(function () {
    $('#formThree__descargarPDF').on('click', function () {
        const element = document.querySelector('#threeForm');
        
        // Verificar si el elemento existe
        if (element) {
            html2canvas(element).then(canvas => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jspdf.jsPDF('p', 'mm', 'a4');

                // Escala para ajustar el contenido al PDF
                const imgWidth = 190; // Ancho en mm
                const pageHeight = 297; // Alto en mm (A4)
                const imgHeight = (canvas.height * imgWidth) / canvas.width;

                let position = 10; // Margen superior
                pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
                
                // Guardar el PDF y mostrar mensaje de éxito
                pdf.save('horarios-seleccionados.pdf');
                toastr.success("PDF descargado correctamente.", "Éxito");
            }).catch(error => {
                // Mostrar mensaje de error si hay un problema al crear el canvas
                toastr.error("Error al generar el PDF: " + error.message, "Error");
            });
        } else {
            // Mostrar mensaje de error si el elemento no se encuentra
            toastr.error("Elemento no encontrado para descargar.", "Error");
        }
    });
});


