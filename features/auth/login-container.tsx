import { CardBody, CardFooter } from "@heroui/card";
import Link from "next/link";
import { Link as HeroLink } from "@heroui/link";

import FormLogin from "./form-login";

import { pathNameConfig } from "@/config/site";

export default function LoginContainer() {
  return (
    <div>
      <CardBody>
        <FormLogin />
      </CardBody>

      <CardFooter>
        <p className="text-center w-full text-sm">
          Don&apos;t have an account?{" "}
          <HeroLink
            as={Link}
            className="text-primary"
            href={pathNameConfig.register.url}
          >
            Sign up
          </HeroLink>
        </p>
      </CardFooter>
    </div>
  );
}
