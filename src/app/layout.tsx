import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Box, Flex, Heading, Link } from '@chakra-ui/react'
import NextLink from 'next/link'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Plataforma de Influenciadoras",
  description: "Cadastro e Visualização de Influenciadoras - Grupo Boticário",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>
        <Providers>
          <Box as="header" bg="purple.600" color="white" py={4} px={8}>
            <Flex justify="space-between" align="center">
              <Heading as="h1" size="md">
                <Link as={NextLink} href="/">
                  Plataforma de Influenciadoras
                </Link>
              </Heading>
              <Flex as="nav" gap={6}>
                <Link as={NextLink} href="/influenciadoras">
                  Visualização
                </Link>
                <Link as={NextLink} href="/cadastro">
                  Cadastro
                </Link>
              </Flex>
            </Flex>
          </Box>
          {children}
        </Providers>
      </body>
    </html>
  );
}
