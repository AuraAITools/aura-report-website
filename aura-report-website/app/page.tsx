import { Button, Flex, Box, Container } from "@radix-ui/themes";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="bg-slate-200 min-h-screen">
      <Container className="p-2">
        <Flex className="gap-2">
          <Image
            src="/logo.png"
            alt="Aura Logo"
            className="animate-spin-slow"
            width={50}
            height={50}
          />
          <Image
            src="/wordmark.png"
            alt="Aura wordmark"
            width={80}
            height={50}
          />
          <Box className="ml-auto" />
          <Button>
            <Link href={"/pricing"}>Pricing</Link>
          </Button>
          <Button className="mr-2">
            <Link href={"/support"}>Support</Link>
          </Button>
          <Button variant="outline" className="rounded-full">
            <Link href={"/login"}>Signup</Link>
          </Button>
        </Flex>
      </Container>
    </main>
  );
}
