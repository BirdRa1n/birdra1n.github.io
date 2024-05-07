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
            .limit(3);

        if (!error) {
            setApps(Object(data));
            setIsloading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <>
            {isLoading ? <div className="justify-center">
                <Spinner className="mt-[25vh]" color="warning"/>
            </div> : <div className="flex justify-center p-10 w-full overflow-x-auto">
                {apps.map((item: { title: string, subtitle: string, platforms: any }, index) => (
                    <div key={index}>
                        <Card isFooterBlurred className="ml-[33px] h-[300px] min-w-[330px] max-w-[330px] sm:min-w-[380px] max-w-[380px]">
                            <CardHeader className="absolute z-10 top-1 flex-col items-start">
                                <p className="text-tiny text-black/60 uppercase font-bold">{item?.title}</p>
                                <h4 className="text-black/60 font-medium text-xl">{item?.subtitle}</h4>
                            </CardHeader>
                            <Image
                                removeWrapper
                                alt="Relaxing app background"
                                className="z-0 w-full h-full object-cover"
                                src={`https://sdaiedyprqaiscilvchp.supabase.co/storage/v1/object/public/apps/${item?.id}/card/card.gif`}
                            />

                        </Card>
                    </div>
                ))}
            </div>}
        </>
    );
};

export default ScrollApps;
