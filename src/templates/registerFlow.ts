import { addKeyword, EVENTS } from "@builderbot/bot";
import sheetsService from "~/services/sheetsService";

const registerFlow = addKeyword(EVENTS.ACTION)
    .addAnswer('¿Quieres comenzar con el Registro?', { capture: true, buttons: [{ body: "Sí, quiero!" }, { body: "No, gracias!" }] }, 
    async (ctx, ctxFn) => {
        if (ctx.body === "No, gracias!") {
            return ctxFn.endFlow("El registro fue cancelado, podes volver a escribirle al bot para registrarte");
        } else if (ctx.body === "Sí, quiero!") {
            await ctxFn.flowDynamic("Perfecto, voy a proceder a hacerte algunas preguntas");
        } else {
            return ctxFn.fallBack("Tenes que elegir alguna de las opciones!");
        }
    })
    .addAnswer('Primero, ¿cuál es tu nombre?', { capture: true }, 
    async (ctx, ctxFn) => {
        await ctxFn.flowDynamic("Perfecto " + ctx.body + " 🎉");
        await ctxFn.state.update({ "name": ctx.body });
    })
    .addAnswer('Ahora, ¿cuál es tu mail?', { capture: true }, 
    async (ctx, ctxFn) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(ctx.body)) {
            return ctxFn.fallBack("Por favor, ingresa un correo electrónico válido. 📧");
        }
        const state = ctxFn.state.getMyState();
        await sheetsService.createUser(ctx.from, state.name, ctx.body);
        await ctxFn.flowDynamic("Excelente! Tus datos ya fueron cargados, ya podes comenzar a utilizar el servicio. 🚀");
    })

    .addAnswer('¿Que Rango de edad tienes?', { capture: false },
    async (ctx, { provider }) => {
          const list = {
            "header": {
              "type": "text",
              "text": "Lista de Rangos"
            },
            "body": {
              "text": "Presiona abajo para ver las opciones"
            },
            "footer": {
              "text": ""
            },
            "action": {
              "button": "Opciones",
              "sections": [
                {
                  "title": "Rango de edades: ",
                  "rows": [
                    {
                      "id": "<LIST_SECTION_1_ROW_1_ID>",
                      "title": "18-25 años",
                      "description": ""
                    },
                    {
                      "id": "<LIST_SECTION_1_ROW_2_ID>",
                      "title": "26-35 años",
                      "description": ""
                    },
                    {
                        "id": "<LIST_SECTION_1_ROW_3_ID>",
                        "title": "36-45 años",
                        "description": ""
                      },
                      {
                        "id": "<LIST_SECTION_1_ROW_4_ID>",
                        "title": "46-55 años",
                        "description": ""
                      },
                      {
                        "id": "<LIST_SECTION_1_ROW_5_ID>",
                        "title": "56-65 años",
                        "description": ""
                      },
                      {
                        "id": "<LIST_SECTION_1_ROW_6_ID>",
                        "title": "65 años o más",
                        "description": ""
                      }
                  ]
                },
                {
                  "title": "<LIST_SECTION_2_TITLE>",
                  "rows": [
                    {
                      "id": "<LIST_SECTION_2_ROW_1_ID>",
                      "title": "<SECTION_2_ROW_1_TITLE>",
                      "description": "<SECTION_2_ROW_1_DESC>"
                    },
                    {
                      "id": "<LIST_SECTION_2_ROW_2_ID>",
                      "title": "<SECTION_2_ROW_2_TITLE>",
                      "description": "<SECTION_2_ROW_2_DESC>"
                    }
                  ]
                }
              ]
            }
          };
          await provider.sendList(ctx.from, list);
        });      

export { registerFlow };
