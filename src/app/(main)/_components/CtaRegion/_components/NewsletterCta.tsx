"use client";

import { useRef, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import Link from "next/link";
import { SendHorizontalIcon } from "lucide-react";
import { HtmlContent } from "@/components/HtmlContent";
import { Button } from "@/components/ui/button";
import type { ICtaMessage } from "@/interfaces";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { postNewsletterSubscription } from "@/lib/fetch/api";
import { toast } from "sonner";

type SubscribeFormInput = {
  emailAddress: string;
  optedIn: boolean;
};

export default function NewsletterCta({
  cta,
  onClose,
}: {
  cta: ICtaMessage;
  onClose?(): void;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [submitted, setSubmitted] = useState(false);
  const [optedIn, setOptedIn] = useState(false);
  const { heading, message, action, dismiss, newsletterOptions } = cta;
  const canDismiss = !!(dismiss && onClose);
  const emailPattern = "^[\\w-_+.]+@[\\w-_]+(?:.[\\w]+)+$";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SubscribeFormInput>();
  const onSubmit: SubmitHandler<SubscribeFormInput> = async ({
    emailAddress,
    optedIn,
  }) => {
    if (!optedIn) return;

    setSubmitted(true);

    toast.promise(
      () =>
        new Promise((resolve, reject) => {
          postNewsletterSubscription({ emailAddress }, { ...newsletterOptions })
            .then(({ success, ...rest }) => {
              if (success) {
                formRef.current?.reset();
                resolve(true);
              } else {
                reject(rest);
              }
            })
            .catch((reason) => {
              console.log("CATCH CALLBACK", reason);
              return reason;
            })
            .finally(() => {
              setSubmitted(false);
            });
        }),
      {
        loading: "Submitting your subscription...",
        success: () => ({
          message: "You are now subscribed!",
          description: "The World thanks you!",
          closeButton: true,
          duration: 10000,
        }),
        error: (reason) => {
          console.log("ERROR CALLBACK", reason);

          if (typeof reason === "string") return { message: reason };

          const { error } = reason;
          const { code } = error;
          switch (code) {
            case 206:
              return {
                type: "success",
                message: "You are already subscribed!",
                description: () => (
                  <>
                    <p>
                      Looks like "{emailAddress}" is already subscribed to this
                      newsletter.
                    </p>
                    <p className="mt-2 font-bold">
                      The World thanks you...again!
                    </p>
                  </>
                ),
                closeButton: true,
                duration: 10000,
              };
            default:
              return {
                message: "Sorry. Subscription Failed",
                description:
                  "We encountered an issue try to to submit your subscription. Please refresh and try again.",
              };
          }
        },
      },
    );
  };

  const handleDismissClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    event.preventDefault();
    onClose?.();
  };

  return (
    <aside className="grid gap-y-4">
      <form
        ref={formRef}
        inert={submitted}
        onSubmit={handleSubmit(onSubmit, () => {
          // console.log("error");
        })}
      >
        <FieldGroup>
          <FieldSet>
            {heading && (
              <FieldLegend className="font-black data-[variant=legend]:text-xl/tight">
                {heading}
              </FieldLegend>
            )}
            {message && (
              <FieldDescription>
                <HtmlContent
                  html={message}
                  className="text-white text-lg/tight [&>*+*]:mt-[0.75em]"
                />
              </FieldDescription>
            )}
            <FieldGroup>
              <Field orientation="horizontal">
                <Input
                  {...register("emailAddress", {
                    required: "Email address is required.",
                    disabled: !optedIn,
                    pattern: {
                      value: new RegExp(emailPattern, "i"),
                      message: "Email address must be valid.",
                    },
                  })}
                  className="h-10 md:text-xl text-foreground placeholder:text-foreground/70 bg-navy-blue/30 not-focus-visible:border-light-blue/50 shadow-none"
                  type="email"
                  placeholder="Email Address..."
                  autoComplete="off"
                  aria-invalid={!!errors?.emailAddress}
                  aria-valid={!errors?.emailAddress}
                />
                <Button
                  className="max-md:hidden"
                  type="submit"
                  variant="action"
                  size="lg"
                  disabled={!optedIn}
                >
                  <span>{action?.name || "Subscribe"}</span>
                  <SendHorizontalIcon aria-hidden />
                </Button>
                <Button
                  className="md:hidden"
                  type="submit"
                  variant="action"
                  size="icon-lg"
                  disabled={!optedIn}
                  title={action?.name || "Subscribe"}
                >
                  <SendHorizontalIcon aria-hidden />
                </Button>
                {canDismiss && (
                  <Button
                    className="cursor-pointer"
                    variant={!action ? "action" : "ghost"}
                    size="sm"
                    onClick={handleDismissClick}
                  >
                    {dismiss.name}
                  </Button>
                )}
              </Field>
            </FieldGroup>
            <Field orientation="horizontal">
              <Checkbox
                {...register("optedIn")}
                className="data-[state=checked]:bg-(--button-background) data-[state=checked]:border-(--button-background-end) text-foreground"
                id="cta-newsletter-opt-in"
                defaultChecked={false}
                onCheckedChange={(checked) => {
                  setOptedIn(checked !== "indeterminate" && checked);
                }}
                value="agree"
              />
              <FieldContent>
                <FieldLabel
                  htmlFor="cta-newsletter-opt-in"
                  className="whitespace-nowrap"
                >
                  <em>
                    I have read and agree to your{" "}
                    <Link
                      className="text-cyan"
                      href="/terms"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Privacy Policy
                    </Link>
                    .
                  </em>
                </FieldLabel>
              </FieldContent>
            </Field>
          </FieldSet>
        </FieldGroup>
      </form>
    </aside>
  );
}
