// @ts-nocheck
import { Link } from "@nextui-org/link";
import { Snippet } from "@nextui-org/snippet";
import { Code } from "@nextui-org/code"
import { button as buttonStyles } from "@nextui-org/theme";
import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import { GithubIcon } from "@/components/icons";
import Apps from "./apps/page";
import ScrollApps from "@/components/home/scrollApps";

export default function Home() {
	return (
		<>
			<section className="flex flex-col items-center justify-center gap-4 py-8 pr-5 pl-5 md:py-10">
				<div className="inline-block max-w-lg text-center justify-center">
					<h1 className={title()}>
						Hi! I'm
					</h1>
					<h1 className={title({ color: "yellow" })}> Dário Jr&nbsp;</h1>

					<h2 className={subtitle({ class: "mt-4" })}>
						Saudações! Sou um entusiasta de tecnologia e desenvolvedor com experiência em desenvolvimento front-end e back-end. Meu foco é criar soluções digitais excepcionais e aprimorar a experiência do usuário.				</h2>
				</div>

				<div className="flex gap-3">
					<Link
						isExternal
						href={'./apps'}
						className={buttonStyles({ color: "warning", radius: "sm", variant: "shadow" })}
					>
						Meus Aplicativos
					</Link>
					<Link
						isExternal
						className={buttonStyles({ variant: "bordered", radius: "full" })}
						href={siteConfig.links.github}
					>
						<GithubIcon size={20} />
						GitHub
					</Link>
				</div>



			</section>
			<ScrollApps />
		</>

	);
}
