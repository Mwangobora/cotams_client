import { Badge } from '@/components/ui/badge';
import type { Curriculum } from '@/types/curriculum';
import type { Module } from '@/types/modules';
import type { ProgramYear } from '@/types/programs';

export const getCurriculumColumns = (
  moduleMap: Map<string, Module>,
  yearMap: Map<string, ProgramYear>
) => [
  {
    header: 'Program Year',
    accessor: (item: Curriculum) => {
      const year = yearMap.get(item.program_year);
      if (!year) return item.program_year;
      return `${year.program_code || year.program_name || 'Program'} - Year ${year.year_number}`;
    },
  },
  {
    header: 'Module',
    accessor: (item: Curriculum) => moduleMap.get(item.module)?.name || item.module_name || item.module,
  },
  { header: 'Semester', accessor: (item: Curriculum) => `Semester ${item.semester}` },
  {
    header: 'Core',
    accessor: (item: Curriculum) => (
      <Badge variant={item.is_core ? 'default' : 'secondary'}>
        {item.is_core ? 'Core' : 'Elective'}
      </Badge>
    ),
  },
];
