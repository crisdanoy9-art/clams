import { Trash2 } from "lucide-react";

type Props = {
  user: any;
  getRoleBadge: (role: any) => React.ReactNode; // Correct function signature
};

export const UserManager = ({ user, getRoleBadge }: Props) => {
  return (
    <tr className="hover:bg-slate-50/50 transition">
      <td className="px-6 py-4 font-mono text-[11px] font-bold text-slate-600">
        {user.id_number}
      </td>
      <td className="px-6 py-4">
        <div className="font-bold text-slate-800">
          {user.first_name} {user.last_name}
        </div>
      </td>
      <td className="px-6 py-4 text-slate-500 text-xs">{user.username}</td>
      <td className="px-6 py-4 text-slate-500 text-xs">{user.email}</td>
      <td className="px-6 py-4">{getRoleBadge(user.role)}</td>
      <td className="px-6 py-4 text-right">
        <button className="p-2 text-slate-300 hover:text-rose-500 transition-all rounded-md hover:bg-rose-50">
          <Trash2 size={16} />
        </button>
      </td>
    </tr>
  );
};
