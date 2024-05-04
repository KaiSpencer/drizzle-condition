import type { AutoRc } from "auto";

import type { INpmConfig } from "@auto-it/npm";
import type { IAllContributorsPluginOptions } from "@auto-it/all-contributors";

const npmOptions: INpmConfig = {
	exact: true,
	canaryScope: "@auto-canary",
};

const allContributorsOptions: IAllContributorsPluginOptions = {
	types: {
		code: [
			"src/**/*",
			"**/package.json",
			"**/tsconfig.json",
			"build.ts",
			"biome.jsonc",
			"vitest.config.ts",
			"package.json",
		],
		doc: ["README.md"],
	},
};

/** Auto configuration */
export default function rc(): AutoRc {
	return {
		author: {
			name: "KaiSpencer",
			email: "kaispencer98@gmail.com",
		},
		owner: "KaiSpencer",
		repo: "drizzle-condition",
		plugins: [
			"released",
			["npm", npmOptions],
			["all-contributors", allContributorsOptions],
		],
	};
}
