export type Operator = '=' | '>' | '<' | 'contains';

export class FilterConditionDto {
  fieldCode!: string; // e.g. "priority"
  operator!: Operator; // e.g. "="
  value!: any; // value depends on field type
}

export class FiltersSearchDto {
  entityType!: string; // e.g. "TRACKING"
  filters!: FilterConditionDto[];
}
