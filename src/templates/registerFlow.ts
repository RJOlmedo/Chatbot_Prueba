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
    });

export { registerFlow };
