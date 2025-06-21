'use client'

import { useState, useEffect, useRef } from 'react'
import {
  Avatar,
  Box,
  Button,
  Container,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Spinner,
  Textarea,
  useToast,
  VStack,
} from '@chakra-ui/react'
import { z } from 'zod'
import axios from 'axios'

// Esquema de validação com Zod
const influencerSchema = z.object({
  fullName: z.string().min(3, 'O nome completo é obrigatório.'),
  instagram: z
    .string()
    .startsWith('@', 'O Instagram deve começar com @.')
    .min(2, 'O @instagram é obrigatório.')
    .refine((val) => !/\s/.test(val), 'O Instagram não pode conter espaços.'),
  profile: z.string().optional(),
  notes: z.string().optional(),
  bio: z.string().optional(),
  followers: z.number().optional(),
  profilePicUrl: z.string().url().optional(),
})

type InfluencerForm = z.infer<typeof influencerSchema>

export default function CadastroPage() {
  const [formData, setFormData] = useState<Partial<InfluencerForm>>({})
  const [errors, setErrors] = useState<Partial<Record<keyof InfluencerForm, string>>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [isScraping, setIsScraping] = useState(false)
  const toast = useToast()
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null)

  const handleReset = () => {
    setFormData({})
    const form = document.querySelector('form')
    if (form) form.reset()
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name as keyof InfluencerForm]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  // Efeito para acionar o scraping
  useEffect(() => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current)
    }

    if (formData.instagram && formData.instagram.length > 1 && formData.instagram.startsWith('@')) {
      setIsScraping(true)
      debounceTimeout.current = setTimeout(async () => {
        try {
          const response = await axios.post('http://localhost:3001/scrape', {
            instagram: formData.instagram,
          })
          const { profilePicUrl, bio, followers } = response.data
          setFormData((prev) => ({
            ...prev,
            profilePicUrl,
            bio,
            followers: followers ? Number(followers) : undefined,
          }))
          toast({
            title: 'Dados preenchidos!',
            description: 'Informações do perfil obtidas com sucesso.',
            status: 'info',
            duration: 3000,
            isClosable: true,
          })
        } catch (error) {
          // Silenciosamente ignora o erro de scraping, o usuário pode preencher manualmente
        } finally {
          setIsScraping(false)
        }
      }, 1000) // Aguarda 1 segundo após o usuário parar de digitar
    } else {
      setIsScraping(false)
    }

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current)
      }
    }
  }, [formData.instagram, toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Omitindo dados que não queremos enviar diretamente no formulário principal
    const { profilePicUrl, ...submissionData } = formData;
    const result = influencerSchema.safeParse(submissionData)

    if (!result.success) {
      const newErrors: Partial<Record<keyof InfluencerForm, string>> = {}
      result.error.errors.forEach((err) => {
        newErrors[err.path[0] as keyof InfluencerForm] = err.message
      })
      setErrors(newErrors)
      return
    }

    setIsLoading(true)
    setErrors({})

    try {
      await axios.post('http://localhost:3001/influencers', { ...result.data, profilePicUrl })
      toast({
        title: 'Sucesso!',
        description: `Influenciadora ${result.data.fullName} cadastrada.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top',
      })
      handleReset()
    } catch (error) {
      toast({
        title: 'Erro no cadastro.',
        description:
          axios.isAxiosError(error) && error.response?.data?.error
            ? error.response.data.error
            : 'Não foi possível cadastrar a influenciadora.',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Container maxW="container.md" py={10}>
      <Heading as="h1" mb={8} textAlign="center">
        Cadastro de Influenciadora
      </Heading>
      <Box as="form" onSubmit={handleSubmit}>
        <VStack spacing={4} align="stretch">
          {formData.profilePicUrl && (
            <FormControl>
                <Avatar size="2xl" name={formData.fullName} src={formData.profilePicUrl} mx="auto" />
            </FormControl>
          )}

          <FormControl isRequired isInvalid={!!errors.fullName}>
            <FormLabel>Nome completo</FormLabel>
            <Input name="fullName" placeholder="Ex: Ana Silva" onChange={handleChange} value={formData.fullName || ''}/>
            {errors.fullName && <FormErrorMessage>{errors.fullName}</FormErrorMessage>}
          </FormControl>

          <FormControl isRequired isInvalid={!!errors.instagram}>
            <FormLabel>@Instagram</FormLabel>
            <InputGroup>
              <Input name="instagram" placeholder="Ex: @ana.silva" onChange={handleChange} value={formData.instagram || ''} />
              <InputRightElement>
                {isScraping && <Spinner size="sm" />}
              </InputRightElement>
            </InputGroup>
            {errors.instagram && <FormErrorMessage>{errors.instagram}</FormErrorMessage>}
          </FormControl>

           <FormControl>
            <FormLabel>Bio</FormLabel>
            <Textarea name="bio" placeholder="Bio do Instagram (preenchido automaticamente)" value={formData.bio || ''} onChange={handleChange} isDisabled />
          </FormControl>

          <FormControl mb={4}>
            <FormLabel>Perfil de atuação (tags)</FormLabel>
            <Input name="profile" placeholder="Ex: cabelo, maquiagem, moda..." onChange={handleChange} value={formData.profile || ''}/>
          </FormControl>

          <FormControl mb={6}>
            <FormLabel>Observações gerais</FormLabel>
            <Textarea name="notes" placeholder="Informações adicionais..." onChange={handleChange} value={formData.notes || ''}/>
          </FormControl>

          <Button type="submit" colorScheme="purple" width="full" size="lg" isLoading={isLoading}>
            Salvar
          </Button>
        </VStack>
      </Box>
    </Container>
  )
} 