import { useState, useEffect } from 'react';

import { Box, Flex,Text, Button, Table, Thead, Tbody, Tr, Th, Td, TableCaption, VStack } from '@chakra-ui/react';
import { AddIcon, MinusIcon } from '@chakra-ui/icons'

import InputForm from '../components/Input';

import api from '../services/api';


export default function Home() {
  const [id, setId] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [clients, setClients] = useState([]);
  const [isOpenForm, setIsOpenForm] = useState(false);
  const [errors, setErrors] = useState({name: null, email: null});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmitClient = async (e) => {
    e.preventDefault();
    if (!isValidForm()) return;

    try {
      setIsLoading(true);

      const { data: { data = {}} = {}} = await api.post('/clients', { name, email})
      setClients(clients.concat(data));
  
      setId(null);
      setName('');
      setEmail('');
      setIsLoading(false);
      setIsOpenForm(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  }

  const handleUpdateClient = async (e) => {
    e.preventDefault();
    if (!isValidForm()) return;

    try {
      setIsLoading(true);

      await api.put(`/clients/${id}`, { name, email});
      setClients(clients.map(client => client._id === id ? {_id: id, name, email} : client));
      
      setId(null)
      setName('');
      setEmail('');
      setIsLoading(false);
      handleToggleForm();
    } catch (error) {
      setIsLoading(false);
    }
  }

  const handleChangeName = ({target: { value }}) => {
    setName(value);
  }

  const handleChangeEmail = ({target: { value }}) => {
    setEmail(value);
  }

  const handleDeleteClient = async (clientId) => {
    try {
      await api.delete(`/clients/${clientId}`)
      setClients(clients.filter(client => client._id != clientId));
    } catch (error) {
      console.error(error);
    }
  }

  const handleSetUpdateFormClient = (client) => {
    const { _id, name, email } = client || {};
    setId(_id);
    setName(name);
    setEmail(email);
    setIsOpenForm(true);
  }

  const handleToggleForm = () => {
    setIsOpenForm(!isOpenForm);
  }

  const isValidForm = () => {
    if (clients.some(client => client._id !== id && client.email === email)) {
      setErrors({email: "Cliente j?? em uso!"});
      return
    }

    setErrors({});
    return true;
  }

  const fetchClients = async () => {
    try {
      const {data: { data }} = await api.get('/clients');
      setClients(data);
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchClients();
  }, [])

  return (
    <Box margin="4">
      <Flex color="white" justifyContent="space-between" margin="4">
          <Text fontSize="lg" color="gray.500">Lista de Clientes</Text>
          <Button size="md" height="40px" width="40px" border="2px" colorScheme="purple" variant="solid" onClick={handleToggleForm}>{isOpenForm ? <MinusIcon w={4} h={4} /> : <AddIcon w={4} h={4} />}</Button>
      </Flex>

      {
        isOpenForm && (
          <VStack marginY="1rem" as="form" onSubmit={id ? handleUpdateClient : handleSubmitClient}>
            <InputForm type="text" label="Nome" name="name" id="name" value={name} error={errors.name} onChange={(e) => handleChangeName(e)} />
            <InputForm type="email" label="E-mail" name="email" id="email" value={email} error={errors.email} onChange={(e) => handleChangeEmail(e)} />

            <Button marginY="4" alignSelf="flex-end" colorScheme="purple" type="submit" isLoading={isLoading}>{id ? 'Atualizar' : 'Cadastrar'}</Button>
          </VStack>
        )
      }

      <Table variant="simple" my="10">
        <Thead bgColor="purple.500">
          <Tr>
            <Th textColor="white">Nome</Th>
            <Th textColor="white">E-mail</Th>
            <Th textColor="white">Ac??es</Th>
          </Tr>
        </Thead>
        <Tbody>
          {
            clients.map((item) => (
              <Tr key={item._id}>
                <Td>{ item.name }</Td>
                <Td>{ item.email }</Td>
                <Td>
                  <Flex justifyContent="space-between">
                    <Button size="sm" colorScheme="yellow" onClick={() => handleSetUpdateFormClient(item)}>Editar</Button>
                    <Button size="sm" colorScheme="red" onClick={() => handleDeleteClient(item._id)}>Remover</Button>
                  </Flex>
                </Td>
              </Tr>
            ))
          }
        </Tbody>
      </Table>
    </Box>
  )
}
