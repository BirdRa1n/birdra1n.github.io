import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from "@nextui-org/react";
import Markdown from 'react-markdown';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm'


interface ModalShowDescriptionProps {
    isOpen: any;
    onOpen: any;
    onOpenChange: any;
    markdown: any;
    title: any;
}


const ModalShowDescription: React.FC<ModalShowDescriptionProps> = ({ isOpen, markdown, title, onOpen, onOpenChange }) => {

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

