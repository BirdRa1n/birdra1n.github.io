// @ts-nocheck
'use client'
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button, Card, CardFooter, CardHeader, Image, Spinner, useDisclosure } from "@nextui-org/react";
import ModalShowDescription from "@/components/apps/modal";

const Apps = () => {
    const [apps, setApps] = useState([]);
    const [isLoading, setIsloading] = useState(true);
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const [markdown, setMarkdown] = useState('');
    const [title, setTitle] = useState('');


    const fetchData = async () => {
        const supabase = createClient();

        const { data, error } = await supabase
            .from('apps')
            .select()
            .order('id');

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
            <Spinner className="min-w-[100%] mt-[38vh]" color="warning"/>
        </div> :
      <div>

                <h1 className="font-bold text-2xl mb-4">Apps</h1>

          <div className="grid grid-cols-1 gap-1 sm:grid-cols-4 gap-4 md:grid-cols-3 gap-3 ">
            {apps.map((item: { title: string, subtitle: string, platforms: any,description:any }, index) => (
                <div key={index} onClick={()=>{setMarkdown(item?.description);setTitle(item?.title); onOpen()}}>
                    <Card isFooterBlurred className="w-full h-[300px] col-span-12 sm:col-span-7">
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
                        <CardFooter className="absolute bg-black/40 bottom-0 z-10 border-t-1 border-default-600 dark:border-default-100">
                            <div className="flex flex-grow gap-2 items-center">
                                <Image
                                    alt="Breathing app icon"
                                    className="rounded w-14 h-13 bg-black"
                                    src={`https://sdaiedyprqaiscilvchp.supabase.co/storage/v1/object/public/apps/${item?.id}/card/icon.png`}
                                />
                                <div className="flex flex-col">
                                    <p className="text-tiny text-white/60">{item?.title}</p>
                                    <p className="text-tiny text-white/60">
                                        {Object.keys(item?.platforms).map((platform, index) => (
                                            <span key={index}>{platform}{index !== Object.keys(item?.platforms).length - 1 ? ', ' : ''}</span>
                                        ))}
                                    </p>
                                </div>
                            </div>
                            <Button radius="full" size="sm">Get App</Button>
                        </CardFooter>
                    </Card>
                    <ModalShowDescription onOpen={onOpen} title={title} markdown={markdown} onOpenChange={onOpenChange} isOpen={isOpen}/>
                </div>
            ))}
        </div>
      </div>
}</>
    );
};

export default Apps;
