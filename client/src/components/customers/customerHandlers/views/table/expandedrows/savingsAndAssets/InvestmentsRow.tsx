import {
  TableCell,
  Box,
  Table,
  TableHead,
  TableRow,
  TableBody,
  ListItemButton,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { DateFields } from '../../../../../../../apiCalls/models/ApiModel';
import { Investment } from '../../../forms/models/CustomerFormModels';
import ColoredTableRow from '../../../../../../../commonComponents/coloredTableRow/ColoredTableRow';
import { useParams } from 'react-router-dom';
import {
  deleteCustSubDocument,
  getCustomerFormData,
} from '../../../../../../../apiCalls/apiCustomerCalls';
import TableLoader from '../../TableLoader';
import FormCountHandler from '../../../forms/FormCountHandler';
import InvestmentForm from '../../../forms/savingsAndAssets/InvestmentForm';

const InvestmentsRow = () => {
  const [formCount, setFormCount] = useState<number>(0);
  const { custId } = useParams();
  const [fields, setFields] = useState<[Investment & DateFields]>();
  const [loading, setLoading] = useState<boolean>(true);
  const colSpan: number = 5;

  const onSubmit = () => {
    updateCustomerFields();
  };

  const removeSubDoc = async (subDocId: string) => {
    const response = await deleteCustSubDocument({
      field: 'investments',
      custId: custId!,
      subDocId: subDocId,
    });

    if (response.success) {
      setFields(response.data as [Investment & DateFields]);
    }
  };

  const updateCustomerFields = async () => {
    const response = await getCustomerFormData({
      field: 'investments',
      _id: custId as string,
    });
    if (response.success) {
      setFields(response.data as [Investment & DateFields]);
      setLoading(false);
    }
  };
  useEffect(() => {
    updateCustomerFields();
  }, [custId]);

  return (
    <TableRow>
      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={colSpan}>
        <Box sx={{ margin: 1 }}>
          <Table size="small" aria-label="more-info">
            {loading ? (
              <TableBody>
                <TableLoader colSpan={colSpan} />
              </TableBody>
            ) : fields!.length > 0 ? (
              fields!.map((inv) => (
                <React.Fragment key={inv._id}>
                  <TableHead>
                    <ColoredTableRow>
                      <TableCell>{inv.belongs}</TableCell>
                      <TableCell />
                      <TableCell />
                      <TableCell />
                      <TableCell />
                      <TableCell align="right">Uppdaterad:</TableCell>
                      <TableCell>{new Date(inv.updatedAt!).toLocaleDateString()}</TableCell>
                    </ColoredTableRow>
                    <TableRow>
                      <TableCell>Typ (ISK, K, Depå)</TableCell>
                      <TableCell>Institut</TableCell>
                      <TableCell>Benämning/ID</TableCell>
                      <TableCell>Insatt</TableCell>
                      <TableCell>Värde</TableCell>
                      <TableCell>Tidsperspektiv</TableCell>
                      <TableCell>Spartid</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>{inv.investmentType || '-'}</TableCell>
                      <TableCell>{inv.institution || '-'}</TableCell>
                      <TableCell>{inv.name || inv._id}</TableCell>
                      <TableCell>{inv.depositedAmount?.toLocaleString() || '-'}</TableCell>
                      <TableCell>{inv.value?.toLocaleString() || '-'}</TableCell>
                      <TableCell>{inv.timePerspective || '-'}</TableCell>
                      <TableCell>{inv.saveForHowLong || '-'}</TableCell>
                    </TableRow>
                  </TableBody>
                  <TableHead>
                    <TableRow>
                      <TableCell>Vägd riskklass</TableCell>
                      <TableCell>Vägd förv. Avgift</TableCell>
                      <TableCell>Skalavgift</TableCell>
                      <TableCell>Månadsspar</TableCell>
                      <TableCell>Tilläggsinvestering</TableCell>
                      <TableCell>När sker tillägget</TableCell>
                      <TableCell>Tänkt tillväxt</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>{inv.riskClass || '-'}</TableCell>
                      <TableCell>{inv.managementFee || '-'}</TableCell>
                      <TableCell>{inv.shellFee || '-'}</TableCell>
                      <TableCell>{inv.monthlySavings || '-'}</TableCell>
                      <TableCell>{inv.additinalInvestment || '-'}</TableCell>
                      <TableCell>{inv.when || '-'}</TableCell>
                      <TableCell>{inv.projectedGrowth || '-'}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={colSpan - 1} />
                      <TableCell>
                        <ListItemButton onClick={() => removeSubDoc(inv._id)}>
                          Ta bort
                        </ListItemButton>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </React.Fragment>
              ))
            ) : (
              <TableBody>
                <TableRow>
                  <TableCell colSpan={colSpan}>Inga bankmedel hittades regisrerade.</TableCell>
                </TableRow>
              </TableBody>
            )}
            <TableBody>
              <FormCountHandler
                formCount={formCount}
                setFormCount={(value) => setFormCount(value)}
                colSpan={colSpan}
              />
            </TableBody>
          </Table>
        </Box>
        {formCount > 0 && (
          <InvestmentForm
            formCount={formCount}
            setFormCount={(value) => setFormCount(value)}
            submitted={onSubmit}
          />
        )}
      </TableCell>
    </TableRow>
  );
};

export default InvestmentsRow;
