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

    .addAnswer('Aquí va un mensaje', { capture: true },
    async (ctx, { provider }) => {
          const list = {
            "header": {
              "type": "text",
              "text": "<HEADER_TEXT>"
            },
            "body": {
              "text": "<BODY_TEXT>"
            },
            "footer": {
              "text": "<FOOTER_TEXT>"
            },
            "action": {
              "button": "<BUTTON_TEXT>",
              "sections": [
                {
                  "title": "<LIST_SECTION_1_TITLE>",
                  "rows": [
                    {
                      "id": "<LIST_SECTION_1_ROW_1_ID>",
                      "title": "<SECTION_1_ROW_1_TITLE>",
                      "description": "<SECTION_1_ROW_1_DESC>"
                    },
                    {
                      "id": "<LIST_SECTION_1_ROW_2_ID>",
                      "title": "<SECTION_1_ROW_2_TITLE>",
                      "description": "<SECTION_1_ROW_2_DESC>"
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
