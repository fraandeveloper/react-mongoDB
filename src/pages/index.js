import { useState } from 'react';

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

  const handleSubmitClient = async (e) => {
    e.preventDefault();
    if (!isValidForm()) return;

    try {
      const { data: { data = {}} = {}} = await api.post('/clients', { name, email})
       
      setClients(clients.concat(data));
  
      setId(null);
      setName('');
      setEmail('');
    } catch (error) {
      console.error(error);
    }
  }

  const handleUpdateClient = async (e) => {
    e.preventDefault();
    if (!isValidForm()) return;

    try {
      const res = await api.post('/clients', { name, email});
      console.log(res);
      return;
       setClients(clients.map(client => client.id === id ? {id: id, name, email} : client));
  
      setName('');
      setEmail('');
    } catch (error) {
      
    }
  }

  const handleChangeName = ({target: { value }}) => {
    setName(value);
  }

  const handleChangeEmail = ({target: { value }}) => {
    setEmail(value);
  }

  const handleDeleteClient = (clientId) => {
    setClients(clients.filter(client => client._id != clientId));
  }

  const handleSetUpdateFormClient = (client) => {
    const { id, name, email } = client || {};
    setId(id)
    setName(name)
    setEmail(email)
  }

  const handleToggleForm = () => {
    setIsOpenForm(!isOpenForm);
  }

  const isValidForm = () => {
    if (clients.some(client => client._id !== id && client.email === email)) {
      setErrors({email: "Cliente já em uso!"});
      return
    }

    setErrors({});
    return true;
  }

  return (
    <Box margin="4">
      <Flex color="white" justifyContent="space-between" margin="4">
          <Text fontSize="lg" color="gray.500">Lista de Clientes</Text>
          <Button size="md" height="40px" width="40px" border="2px" colorScheme="blue" variant="solid" onClick={handleToggleForm}>{isOpenForm ? <MinusIcon w={4} h={4} /> : <AddIcon w={4} h={4} />}</Button>
      </Flex>

      {
        isOpenForm && (
          <VStack marginY="1rem" as="form" onSubmit={id ? handleUpdateClient : handleSubmitClient}>
            <InputForm type="text" label="Nome" name="name" id="name" value={name} error={errors.name} onChange={(e) => handleChangeName(e)} />
            <InputForm type="email" label="E-mail" name="email" id="email" value={email} error={errors.email} onChange={(e) => handleChangeEmail(e)} />

            <Button marginY="4" alignSelf="flex-end" colorScheme="blue" type="submit">{id ? 'Atualizar' : 'Cadastrar'}</Button>
          </VStack>
        )
      }

      <Table colorScheme="teal" my="4">
        <TableCaption>Imperial to metric conversion factors</TableCaption>
        <Thead >
          <Tr>
            <Th>Nome</Th>
            <Th>E-mail</Th>
            <Th>Acões</Th>
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
                    <Button size="sm" colorScheme="red" onClick={() => handleDeleteClient(item.id)}>Remover</Button>
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
