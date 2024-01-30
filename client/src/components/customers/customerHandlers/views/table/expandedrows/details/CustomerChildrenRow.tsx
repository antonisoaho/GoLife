import {
  TableCell,
  Box,
  Table,
  TableHead,
  TableRow,
  TableBody,
  ListItemButton,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { DateFields } from '../../../../../../../apiCalls/models/ApiModel';
import { CustomerChildren } from '../../../forms/models/CustomerFormModels';
import ColoredTableRow from '../../../../../../../commonComponents/coloredTableRow/ColoredTableRow';
import FormCountHandler from '../../../forms/FormCountHandler';
import CustomerChildForm from '../../../forms/details/CustomerChildForm';
import {
  deleteCustSubDocument,
  getCustomerFormData,
} from '../../../../../../../apiCalls/apiCustomerCalls';
import { useParams } from 'react-router-dom';
import TableLoader from '../../TableLoader';

const CustomerChildrenRow = () => {
  const [formCount, setFormCount] = useState<number>(0);
  const { custId } = useParams();
  const [fields, setFields] = useState<[CustomerChildren & DateFields]>();
  const [loading, setLoading] = useState<boolean>(true);
  const colSpan: number = 7;

  const onSubmit = () => {
    updateCustomerFields();
  };

  const updateCustomerFields = async () => {
    const response = await getCustomerFormData({
      field: 'customerChildren',
      _id: custId as string,
    });

    if (response.success) {
      setFields(response.data!);
      setLoading(false);
    }
  };

  useEffect(() => {
    updateCustomerFields();
  }, [custId]);

  const removeSubDoc = async (subDocId: string) => {
    const response = await deleteCustSubDocument({
      field: 'customerChildren',
      custId: custId!,
      subDocId: subDocId,
    });

    if (response.success) setFields(response.data);
  };

  return (
    <TableRow>
      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
        <Box sx={{ margin: 1 }}>
          <Table size="small" aria-label="more-info">
            <TableHead>
              <ColoredTableRow>
                <TableCell>Namn</TableCell>
                <TableCell>Tillhör</TableCell>
                <TableCell>Barnbidrag räknas</TableCell>
                <TableCell>Född</TableCell>
                <TableCell>Bor hemma till</TableCell>
                <TableCell />
                <TableCell align="right">Uppdaterad</TableCell>
              </ColoredTableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableLoader colSpan={colSpan} />
              ) : (
                fields!.map((child) => (
                  <TableRow key={child._id}>
                    <TableCell>{child.name}</TableCell>
                    <TableCell>{child.belongs || '-'}</TableCell>
                    <TableCell>{child.childSupportCounts ? 'Ja' : 'Nej'}</TableCell>
                    <TableCell>{child.yearMonth}</TableCell>
                    <TableCell>{child.livesAtHomeToAge}</TableCell>
                    <TableCell align="right">
                      {new Date(child.updatedAt!).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <ListItemButton onClick={() => removeSubDoc(child._id)}>
                        Ta bort
                      </ListItemButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
              <FormCountHandler
                formCount={formCount}
                setFormCount={(value) => setFormCount(value)}
                colSpan={colSpan}
              />
            </TableBody>
          </Table>
        </Box>
        {formCount > 0 && (
          <CustomerChildForm
            submitted={onSubmit}
            formCount={formCount}
            setFormCount={(value) => setFormCount(value)}
          />
        )}
      </TableCell>
    </TableRow>
  );
};

export default CustomerChildrenRow;
