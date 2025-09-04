import { Textarea } from "@heroui/input";
import { Button, Form, Input, Select, SelectItem } from "@heroui/react";
import { button as buttonStyles } from "@heroui/theme";
import React, { useEffect } from "react";

import supabase from "@/utils/supabase/client";
import DefaultLayout from "@/layouts/default";

export default function DocsPage() {
  const [apps, setApps] = React.useState<any[]>([]);
  const [selectedSubject, setSelectedSubject] = React.useState("");
  const [action, setAction] = React.useState<string | null>(null);

  const subjects = [
    "Contact",
    "Support",
    "Feedback",
    "Bug report",
    "Delete account from app",
    "Other",
  ];

  useEffect(() => {
    const fetchApps = async () => {
      const { data } = await supabase.from("apps").select("*");

      if (data) setApps(data);
    };

    fetchApps();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const { name, email, subject, message } = Object.fromEntries(formData) as {
      name: string;
      email: string;
      subject: string;
      message: string;
    };

    await handleSubmitContact(name, email, subject, message);
  };

  const handleSubmitContact = async (
    name: string,
    email: string,
    subject: string,
    message: string,
  ) => {
    const { error } = await supabase
      .from("contact")
      .insert({ name, email, subject, message });

    if (error) {
      alert("Error sending message. Please try again.");
      console.log(error);

      return;
    }
    alert("Message sent successfully!");
  };

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-lg text-center justify-center">
          <Form
            className="w-full max-w-xs flex flex-col gap-4"
            validationBehavior="native"
            onSubmit={handleSubmit}
          >
            <div className="flex space-x-4">
              <Input
                isRequired
                errorMessage="Please enter a valid username"
                label="Name"
                labelPlacement="outside"
                name="name"
                placeholder="Enter your username"
                radius="sm"
                type="text"
              />
              <Input
                isRequired
                errorMessage="Please enter a valid email"
                label="Email"
                labelPlacement="outside"
                name="email"
                placeholder="Enter your email"
                radius="sm"
                type="email"
              />
            </div>
            {selectedSubject === "other" ? (
              <Input
                isRequired
                label="Subject"
                labelPlacement="outside"
                name="subject"
                placeholder="Enter your subject"
                radius="sm"
              />
            ) : (
              <Select
                className="max-w-xs"
                items={subjects.map((key) => ({ key, label: key }))}
                label="Subject"
                name="subject"
                placeholder="Select subject of your message"
                onChange={(e) => setSelectedSubject(e.target.value)}
              >
                {(item) => <SelectItem>{item.label}</SelectItem>}
              </Select>
            )}
            <Textarea
              isRequired
              labelPlacement="outside"
              name="message"
              placeholder="Enter your message"
              radius="sm"
            />
            <div className="flex gap-2">
              <Button
                className={buttonStyles({
                  radius: "sm",
                  variant: "shadow",
                  className:
                    "bg-gradient-to-b from-[#6FEE8D] to-[#17c964] text-white",
                })}
                type="submit"
              >
                Submit
              </Button>
            </div>
            {action && (
              <div className="text-small text-default-500">
                Action: <code>{action}</code>
              </div>
            )}
          </Form>
        </div>
      </section>
    </DefaultLayout>
  );
}
