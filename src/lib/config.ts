import config from '../../config.json';

type Config = {
	readonly base_url: string;
	readonly site_title: string;
	readonly site_description: string;
	readonly site_keywords: { keyword: string }[];
};

export default config as Config;
