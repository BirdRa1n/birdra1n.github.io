// pages/404.tsx
import NextLink from "next/link";

import { StateMessage } from "@/components/page";
import { useI18n } from "@/i18n";
import DefaultLayout from "@/layouts/default";

export default function NotFoundPage() {
  const { t } = useI18n();

  return (
    <DefaultLayout title="404">
      <div className="container-x pt-40 pb-20 text-center">
        <p className="display-xl text-gradient">404</p>
        <StateMessage
          action={
            <NextLink className="btn btn-solid" href="/">
              {t.nav.home}
            </NextLink>
          }
          title={t.common.notFound}
        />
      </div>
    </DefaultLayout>
  );
}
