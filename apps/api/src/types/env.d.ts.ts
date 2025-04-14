import type { EnvConfig } from "../config/configuration";

declare global {
	namespace NodeJS {
		interface ProcessEnv extends EnvConfig {}
	}
}
