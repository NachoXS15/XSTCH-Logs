import { TemarioProps } from '../lib/definitions'


const TemasCatedras: TemarioProps[] = [
    {
        name: "Fundamentos de Programación",
        temario: [{
                "title": "",
                "temas": [
                    "Introducción al codigo y pseudocódigo",
                    "Guia por la interfaz de Pseint.",
                    "Variables y tipos de datos",
                    "Funciones basicas: escribir, leer y asignar.",
                    "Estructuras condicionales: si-entonces y según.",
                    "Operadores lógicos.",
                    "Estructuras repetitivas: do-while y while",
                    "Mayor y Menor",
                    "Estructura For",
                    "Arrays unidimensionales (vectores)",
                    "Arrays Multidimensionales (matrices). /LIBRES"
                ]

        }]
    },
    {
        name: "Programación I",
        temario: [
            {
                "title": "HTML - Hyper Text Markup Lenguage",
                "temas": [
                    "Introducción y usos",
                    "Etiquetas, atributos, contenidos y valores",
                    "Etiquetas de Texto",
                    "Etiquetas semánticas",
                    "Etiquetas de Enlace",
                    "Rutas absolutas y relativas",
                    "Imágenes",
                    "Etiquetas de línea y bloque",
                    "Listas ordenadas y desordenadas",
                    "Tablas, columnas y filas",
                    "Formularios"
                ]
            },
            {
                "title": "CSS - Cascading Style Sheet",
                "temas": [
                    "Introducción y usos",
                    "Frameworks",
                    "Conexión con HTML.",
                    "Selectores.",
                    "Ámbitos de uso.",
                    "Herencia y reglas.",
                    "Estilos a cajas y textos.",
                    "Colores",
                    "Unidades de medida y colores.",
                    "Box Model (ancho y alto, margin, padding y border).",
                    "Imágenes.",
                    "Posicionamiento (position, float y flexbox)."
                ]
            },
        ]
    },
    {
        name: "Programación II",
        temario: [
            {
                "title": "PHP - HyperText Preprocessor",
                "temas": [
                    "Introducción.",
                    "Qué es programación dinámica.",
                    "Qué es PHP, un interprete y XAMPP.",
                    "Comparación con Fundamentos de Programación.",
                    "Qué es una variable.",
                    "Tipos de datos en PHP.",
                    "Qué es un array unidimensional y multidimensional.",
                    "Condicionales, if y switch statements.",
                    "Tipos de igualdad.",
                    "Operadores lógicos.",
                    "Estructuras repetitivas: for, while y foreach.",
                    "Variables SESSION, GET y POST",
                    "Validación de datos y usuarios",
                    "Buscador"
                ]
            },
            {
                "title": "SQL - Structured Query Lenguage",
                "temas": [
                    "Introducción.",
                    "Qué es una base de datos.",
                    "Comparación con Excel (tablas).",
                    "Introducción a PhpMyAdmin (GUI).",
                    "Creación de base de datos y manejo de tablas.",
                    "Tipos de datos.",
                    "Claves primarias y foraneas.",
                    "Instrucciones y consultas.",
                    "Código de SQL y relación con PHP.",
                    "Importar, insertar y exportar.",
                    "Consultas select, insert, update y delete"
                ]
            },
            {
                "title": "JavaScript",
                "temas": [
                    "Introducción.",
                    "Variables",
                    "Tipos de datos",
                    "Manejo de DOM",
                    "Validación de formularios"
                ]
            },
        ]
    },
    
    // {name: "Ingles I", index: 4},
    // {name: "Ingles II", index: 5},
    // {name: "Seminario de Actualización", index: 6},
]

export default TemasCatedras