export const colors = {
  primary: '#2F7E79', primaryDark: '#1F5C58', bg: '#F5F8F7', card: '#FFFFFF',
  text: '#1B2B2A', muted: '#7A8B89', border: '#E1E8E7',
  income: '#22A06B', expense: '#E5484D', white: '#FFFFFF',
};
export const CATEGORIES = [
  { name: 'Food', icon: 'fast-food', color: '#F59E0B', type: 'expense', budget: 6000 },
  { name: 'Transport', icon: 'bus', color: '#3B82F6', type: 'expense', budget: 3000 },
  { name: 'Shopping', icon: 'bag', color: '#EC4899', type: 'expense', budget: 5000 },
  { name: 'Bills', icon: 'receipt', color: '#8B5CF6', type: 'expense', budget: 8000 },
  { name: 'Health', icon: 'medkit', color: '#EF4444', type: 'expense', budget: 2500 },
  { name: 'Entertainment', icon: 'film', color: '#14B8A6', type: 'expense', budget: 2000 },
  { name: 'Other', icon: 'ellipsis-horizontal-circle', color: '#64748B', type: 'expense', budget: 2000 },
  { name: 'Salary', icon: 'cash', color: '#22A06B', type: 'income', budget: 0 },
  { name: 'Freelance', icon: 'laptop', color: '#0EA5E9', type: 'income', budget: 0 },
];
export const catInfo = (name) => CATEGORIES.find((c) => c.name === name) || CATEGORIES[6];
