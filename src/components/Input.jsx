import { FormControl, FormLabel, Input, FormErrorMessage } from "@chakra-ui/react";

const InputForm = ({ label, name, error = null, ...rest }) => {
  return (
    <FormControl isInvalid={!!error} id={name} marginY="1rem">
      <FormLabel>{ label }</FormLabel>
      <Input name={name} {...rest} />
      {!!error && <FormErrorMessage>{ error }</FormErrorMessage>  }
    </FormControl>
  )
}

export default InputForm;