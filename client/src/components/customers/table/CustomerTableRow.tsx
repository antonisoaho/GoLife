import { IconButton, TableCell, TableRow } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useState } from 'react';

interface RowProps {
  fieldName: string;
  fieldLength: number;
  children: React.ReactNode;
}

const CustomerTableRow: React.FC<RowProps> = ({ fieldName, fieldLength, children }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell
          style={{
            width: 'fit-content',
            whiteSpace: 'nowrap',
            maxWidth: '10px',
            padding: 0,
            paddingLeft: '16px',
          }}>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => {
              setOpen(!open);
            }}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row" sx={{ fontWeight: '500' }}>
          {fieldName}
        </TableCell>

        <TableCell align="right">{fieldLength}</TableCell>
        <TableCell />
      </TableRow>
      {open && children}
    </>
  );
};

export default CustomerTableRow;
