import { version } from "mongoose";
import swaggerAutogen from "swagger-autogen";

const doc = {
    info: {
        version: "v.0.0.1",
        title: "Dokumentasi API Acara",
        description: "Dokumentasi API Acara"
    },
    servers: [
        {
            url: "http://localhost:3000/api",
            description: "Local Server"
        },
        {
            url: "https://mern-wpu.vercel.app/api",
            description: "Deploy Server"
        }
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer",
            },
        },
        schemas: {
            RegisterRequest: {
                fullName: "Dimas Prasetyo",
                username: "TOMAT",
                email: "test.tomat@yopmail.com",
                password: "Mdrdimas1",
                confirmPassword: "Mdrdimas1"
            },
            LoginRequest: {
                identifier: "TOMAT",
                password: "Mdrdimas1"
            },
            ActivationRequest: {
                code: "123456"
            },
        }
    }
}
const outputFile = "./swagger_output.json";
const endpointsFiles = ["../routes/api.ts"];

swaggerAutogen({openapi: "3.0.0"})(outputFile, endpointsFiles, doc)