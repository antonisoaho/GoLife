import React, { useEffect, useState } from 'react';
import { CustomerDetails } from './models/CustomerFormModels';
import {
  Button,
  FormControl,
  InputLabel,
  ListItemButton,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { formatDate } from './models/commonFunctions';
import { useForm, SubmitHandler } from 'react-hook-form';
import { updateCustomer } from '../../../../../apiCalls/apiCustomerCalls';
import { useParams } from 'react-router-dom';
import { removeFormByIndex } from './models/commonFunctions';
import { CustomFormProps } from './models/FormProps';

const CustomerDetailsForm: React.FC<CustomFormProps> = ({ submitted, formCount, setFormCount }) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = useForm<CustomerDetails[]>();
  const [details, setDetails] = useState<CustomerDetails[]>([]);
  const { custId } = useParams();

  const onSubmit: SubmitHandler<CustomerDetails[]> = async (data) => {
    console.log('data', data);
    const response = await updateCustomer({
      field: 'customerDetails',
      _id: custId as string,
      formData: data,
    });

    if (response.success) {
      if (submitted) submitted();
    }
  };

  useEffect(() => {
    const newDetails = [];
    for (let i = 0; i < formCount; i++) {
      newDetails.push({
        name: '',
        status: '',
        yearMonth: '',
      });
    }
    setDetails(newDetails);
  }, [formCount]);

  const removeDetail = (index: number) => {
    if (details.length > 0) {
      setDetails(removeFormByIndex(details, index));
      setFormCount(formCount - 1);
    }
  };

  const selectItems = [
    {
      value: 'Gift',
      label: 'Gift',
    },
    {
      value: 'Sambo',
      label: 'Sambo',
    },
    {
      value: 'Särbo',
      label: 'Särbo',
    },
    {
      value: 'Singel',
      label: 'Singel',
    },
  ];

  const handleDateChange = (date: Date, index: number) => {
    const newDate = formatDate(date);
    setValue(`${index}.yearMonth`, newDate);
  };

  const inputProps = {
    sx: { m: 0, width: '100%' },
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Table>
        <TableBody>
          {details.map((detail, index) => (
            <TableRow key={index}>
              <TableCell>
                <TextField
                  label="Namn"
                  {...register(`${index}.name`, { required: 'Vänligen ange ett namn.' })}
                  {...inputProps}
                />
              </TableCell>
              <TableCell>
                <FormControl>
                  <InputLabel id="status-label">Relationsstatus</InputLabel>
                  <Select
                    sx={{ minWidth: '10rem' }}
                    {...register(`${index}.status`)}
                    defaultValue={detail.status}
                    labelId="status-label"
                    label="Relationsstatus">
                    {selectItems.map((item) => (
                      <MenuItem value={item.value} key={item.value}>
                        {item.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </TableCell>
              <TableCell>
                <DatePicker
                  label="Födelsedatum"
                  views={['month', 'year']}
                  {...register(`${index}.yearMonth`, { required: 'Var vänlig välj ett datum.' })}
                  onChange={(date) => handleDateChange(date as Date, index)}
                  {...inputProps}
                />
              </TableCell>
              <TableCell align="right">
                <ListItemButton onClick={() => removeDetail(index)}>Ta bort</ListItemButton>
              </TableCell>
            </TableRow>
          ))}
          {formCount > 0 && (
            <TableRow>
              <TableCell colSpan={4} align="right">
                <Button type="submit" disabled={isSubmitting}>
                  {!isSubmitting ? 'Spara' : 'Sparar...'}
                </Button>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </form>
  );
};

export default CustomerDetailsForm;
