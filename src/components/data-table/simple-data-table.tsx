import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type DataValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | string[]
  | React.ReactNode;

type DataRow = { id: string } & Record<string, DataValue>;

type Column = {
  key: string;
  header: string;
  render?: (row: DataRow) => React.ReactNode;
};

export function SimpleDataTable({
  title,
  columns,
  rows,
  emptyLabel,
}: {
  title: string;
  columns: Column[];
  rows: DataRow[];
  emptyLabel?: string;
}) {
  return (
    <Card className="card-shadow border-border/60 bg-card/90">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{title}</CardTitle>
        <Badge variant="neutral">{rows.length} rows</Badge>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead key={String(column.key)}>{column.header}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length ? (
                rows.map((row) => (
                  <TableRow key={row.id}>
                    {columns.map((column) => (
                      <TableCell key={String(column.key)}>
                        {column.render
                          ? column.render(row)
                          : String(row[column.key] ?? "")}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="py-10 text-center text-muted-foreground">
                    {emptyLabel ?? "No records yet."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
