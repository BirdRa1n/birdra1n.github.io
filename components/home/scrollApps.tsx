// @ts-nocheck
'use client'
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button, Card, CardFooter, CardHeader, Image, Spinner } from "@nextui-org/react";

const ScrollApps = () => {
    const [apps, setApps] = useState([]);
    const [isLoading, setIsloading] = useState(true);

    const fetchData = async () => {
        const supabase = createClient();

        const { data, error } = await supabase
            .from('apps')
            .select()
            .order('id');

        const { data: cardStyles, error: errorStyle } = await supabase.from('styleAppCard').select().order('id')


        if (!error || !errorStyle) {
            setApps(Object(data));
            // Mapear estilos para cada aplicativo
            const appsWithStyles = data?.map(app => {
                const stylesForApp = cardStyles.filter(style => style.appId === app.id);
                return { ...app, style: stylesForApp[0] };
            });
            setApps(appsWithStyles);
            setIsloading(false);
        }
    };


    useEffect(() => {
        fetchData();
    }, []);

    return (
        <>
            {isLoading ? <center className="justify-center">
                <Spinner className="mt-[25vh]" color="warning" />
            </center> : <div className="flex justify-center p-10 w-full overflow-x-auto hide-scrollbar">
                {apps.map((item: { title: string, subtitle: string, platforms: any, style: { mt_cardImage: number } }, index) => (
                    <div key={index}>
                        <Card style={{ borderRadius: 10 }} isFooterBlurred className="ml-[33px] h-[300px] min-w-[330px] md:min-w-[400px] max-w-[330px] sm:min-w-[330px] max-w-[380px]">
                            <CardHeader className="absolute z-10 top-1 flex-col items-start">
                                <h4 className="text-black/60 font-medium text-xl">{item?.subtitle}</h4>
                            </CardHeader>
                            <Image
                                style={{ marginTop: item?.style?.mt_cardImage }}
                                removeWrapper
                                alt="Relaxing app background"
                                className="z-0 w-full h-full object-cover"
                                src={`https://sdaiedyprqaiscilvchp.supabase.co/storage/v1/object/public/apps/${item?.id}/card/card.webp`}
                            />

                        </Card>
                    </div>
                ))}
            </div>}
        </>
    );
};

export default ScrollApps;
