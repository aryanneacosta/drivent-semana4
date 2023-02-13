import { ApplicationError } from "@/protocols";

export function cannotBookError() : ApplicationError {
    return {
        name: "CannotBookError",
        message: "Cannot book this room!"
    };
}