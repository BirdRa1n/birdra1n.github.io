'use client'
import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from "@nextui-org/react";
import Markdown from 'react-markdown';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm'
import { GithubIcon } from "../icons";


interface ModalShowDescriptionProps {
    isOpen: any;
    onOpen: any;
    onOpenChange: any;
    markdown: any;
    title: any;
    github: any;
}
import { useRouter } from 'next/navigation'



const ModalShowDescription: React.FC<ModalShowDescriptionProps> = ({ isOpen, markdown, title, onOpen, onOpenChange, github }) => {
    const router = useRouter()

    return (
        <>
            <Modal placement="auto" isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false} isKeyboardDismissDisabled={true}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1 ">{title}</ModalHeader>
                            <ModalBody>
                                <div className="max-h-[50vh] overflow-y-scroll">
                                    <article className="prose prose-img:rounded-xl prose-headings:underline prose-a:text-blue-600">
                                        <Markdown>{markdown}</Markdown>
                                    </article>
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                {github&&<Button radius="sm" onPress={()=>{onClose(); router.replace(`${github}/releases`)}}>
                                    <GithubIcon size={20} />
                                    GitHub
                                </Button>}

                                <Button radius="sm" color="warning" onPress={onClose}>
                                    Download
                                </Button>
                            </ModalFooter>

                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}

export default ModalShowDescription;

