import { Textarea } from "@heroui/input";
import { Button, Form, Input, Select, SelectItem } from "@heroui/react";
import { button as buttonStyles } from "@heroui/theme";
import React, { useState } from "react";
import { motion } from "framer-motion";
import supabase from "@/utils/supabase/client";
import DefaultLayout from "@/layouts/default";
import { title } from "@/components/primitives";

export default function ContactPage() {
  const [selectedSubject, setSelectedSubject] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const subjects = [
    "Contact",
    "Support",
    "Feedback",
    "Bug report",
    "Delete account from app",
    "Other",
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    const formData = new FormData(e.currentTarget);
    const { name, email, subject, message } = Object.fromEntries(formData) as {
      name: string;
      email: string;
      subject: string;
      message: string;
    };

    const { error } = await supabase
      .from("contact")
      .insert({ name, email, subject, message });

    if (error) {
      setSubmitStatus({
        type: "error",
        message: "Error sending message. Please try again.",
      });
      setIsSubmitting(false);
      return;
    }

    setSubmitStatus({
      type: "success",
      message: "Message sent successfully! I'll get back to you soon.",
    });
    setIsSubmitting(false);
    e.currentTarget.reset();
    setSelectedSubject("");
  };

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-8 py-8 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl"
        >
          <h1 className={title()}>Get in Touch</h1>
          <p className="text-default-500 mt-4">
            Have a question or want to work together? Feel free to reach out!
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="w-full max-w-lg"
        >
          <Form
            className="w-full flex flex-col gap-6 bg-default-50 dark:bg-default-100/50 p-8 rounded-2xl shadow-lg"
            validationBehavior="native"
            onSubmit={handleSubmit}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                isRequired
                errorMessage="Please enter your name"
                label="Name"
                labelPlacement="outside"
                name="name"
                placeholder="John Doe"
                radius="lg"
                type="text"
                variant="bordered"
              />
              <Input
                isRequired
                errorMessage="Please enter a valid email"
                label="Email"
                labelPlacement="outside"
                name="email"
                placeholder="john@example.com"
                radius="lg"
                type="email"
                variant="bordered"
              />
            </div>

            {selectedSubject === "Other" ? (
              <Input
                isRequired
                label="Subject"
                labelPlacement="outside"
                name="subject"
                placeholder="Enter your subject"
                radius="lg"
                variant="bordered"
              />
            ) : (
              <Select
                isRequired
                items={subjects.map((key) => ({ key, label: key }))}
                label="Subject"
                labelPlacement="outside"
                name="subject"
                placeholder="Select a subject"
                radius="lg"
                variant="bordered"
                onChange={(e) => setSelectedSubject(e.target.value)}
              >
                {(item) => <SelectItem key={item.key}>{item.label}</SelectItem>}
              </Select>
            )}

            <Textarea
              isRequired
              label="Message"
              labelPlacement="outside"
              minRows={6}
              name="message"
              placeholder="Tell me about your project or question..."
              radius="lg"
              variant="bordered"
            />

            {submitStatus.type && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-lg text-sm ${
                  submitStatus.type === "success"
                    ? "bg-success-50 text-success-700 dark:bg-success-900/20 dark:text-success-400"
                    : "bg-danger-50 text-danger-700 dark:bg-danger-900/20 dark:text-danger-400"
                }`}
              >
                {submitStatus.message}
              </motion.div>
            )}

            <Button
              className={buttonStyles({
                radius: "lg",
                variant: "shadow",
                size: "lg",
                className:
                  "bg-gradient-to-b from-[#6FEE8D] to-[#17c964] text-white font-semibold",
              })}
              isLoading={isSubmitting}
              type="submit"
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </Button>
          </Form>
        </motion.div>
      </section>
    </DefaultLayout>
  );
}
