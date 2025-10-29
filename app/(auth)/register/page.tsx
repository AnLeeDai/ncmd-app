import Link from "next/link";
import { Link as HeroLink } from "@heroui/link";

export default function RegisterPage() {
  return (
    <div className="mx-1 text-center">
      <h1>Sorry, this page is not available.</h1>

      <p>
        Please check back later.{" "}
        <HeroLink as={Link} href="/">
          Go back home
        </HeroLink>
      </p>
    </div>
  );
}
