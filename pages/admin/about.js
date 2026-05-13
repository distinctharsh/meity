import { useState, useEffect } from 'react';
import Skeleton, { SkeletonTable } from '@/components/Skeleton';
import AdminLayout from '@/components/admin/AdminLayout';

export default function AdminAboutPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/about');
      if (!res.ok) throw new Error('Failed to load');
      const data = await res.json();
      setItems(data);
    } catch (e) {
      setError(e.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!items || items.length === 0) return;
    if (showForm) return;

    let cancelled = false;
    let attemptTimer;

    const tryInit = () => {
      if (cancelled) return;
      const $ = window.jQuery;
      if (!$ || !$.fn || !$.fn.DataTable) {
        attemptTimer = setTimeout(tryInit, 50);
        return;
      }

      const selector = '#about-content-table';
      try {
        if ($.fn.dataTable.isDataTable(selector)) {
          try {
            $(selector).DataTable().destroy(false);
          } catch {
          }
        }

        $(selector).DataTable({
          paging: true,
          searching: true,
          info: true,
          lengthChange: false,
          pageLength: 5,
          order: [[4, 'asc']],
          autoWidth: false,
          responsive: true,
          dom: '<"flex items-center justify-between mb-4"lf>rtip',
          language: {
            paginate: {
              first: '«',
              last: '»',
              next: '›',
              previous: '‹'
            },
            search: 'Search:',
            info: 'Showing _START_ to _END_ of _TOTAL_ entries',
            lengthMenu: 'Show _MENU_ entries'
          },
          columnDefs: [
            { orderable: false, targets: -1 },
            { width: '20%', targets: 0 },
            { width: '25%', targets: 1 },
            { width: '10%', targets: 2 },
            { width: '10%', targets: 3 },
            { width: '10%', targets: 4 },
            { width: '15%', targets: 5 },
          ],
        });
      } catch (e) {
        console.error('DataTable init failed (about)', e);
      }
    };

    tryInit();

    return () => {
      cancelled = true;
      if (attemptTimer) clearTimeout(attemptTimer);
      try {
        const $ = window.jQuery;
        const selector = '#about-content-table';
        if ($ && $.fn && $.fn.dataTable && $.fn.dataTable.isDataTable(selector)) {
          $(selector).DataTable().destroy(false);
        }
      } catch {
      }
    };
  }, [items, showForm]);

  const onDelete = async (id) => {
    if (!confirm('Delete this content section?')) return;
    const res = await fetch(`/api/admin/about/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      alert('Delete failed');
    } else {
      await load();
    }
  };

  const onSaved = async () => {
    setShowForm(false);
    setEditing(null);
    await load();
  };

  const initializeDefaultContent = async () => {
    if (!confirm('This will create default content sections based on the current About page. Continue?')) return;
    
    const defaultContent = [
      {
        section_key: 'vision',
        title: 'Vision Statement',
        content: 'The Cabinet Secretariat is responsible for the administration of the Government of India (Transaction of Business) Rules, 1961 and the Government of India (Allocation of Business) Rules 1961, facilitating smooth transaction of business in Ministries/ Departments of the Government.',
        content_type: 'text',
        display_order: 1
      },
      {
        section_key: 'functions',
        title: 'Functions',
        content: 'The Cabinet Secretariat functions directly under the Prime Minister. The administrative head of the Secretariat is the Cabinet Secretary who is also the ex-officio Chairman of the Civil Services Board. The business allocated to Cabinet Secretariat under the Government of India (Allocation of Business) Rules, 1961 includes (i) Secretarial assistance to the Cabinet and Cabinet Committees; and (ii) Rules of Business.\n\nThe Cabinet Secretariat is responsible for the administration of the Government of India (Transaction of Business) Rules, 1961 and Government of India (Allocation of Business) Rules, 1961 facilitating smooth transaction of business in Ministries/ Departments of the Union Government. The Secretariat provides Secretarial assistance to the Cabinet and its Committees, and also assists in decision-making in Government by ensuring Inter-Ministerial coordination, ironing out differences amongst Ministries/Departments and evolving consensus through the instrumentality of the standing / ad hoc Committees of Secretaries. Through this mechanism, new policy initiatives are also promoted. Management of major crisis situations in the country and coordinating activities of various Ministries/Departments in such a situation is also one of the functions of the Cabinet Secretariat.',
        content_type: 'text',
        display_order: 2
      },
      {
        section_key: 'allocation_disposal',
        title: 'Allocation and disposal of Government Business',
        content: 'The Government of India (Allocation of Business) Rules, 1961 (AoB Rules) and the Government of India (Transaction of Business) Rules, 1961 (ToB Rules) have been framed under Article 77 (3) of the Constitution of India. The First Schedule to the AoB Rules specifies the Ministries, Department, Offices and Secretariats while the Second Schedule lists out the business allocated to different Ministries/ Departments of the Government of India.\n\nThe ToB Rules lay down the procedure for disposal of business and decision making in Government of India. The business of the Government of India is normally disposed of at various levels within the Ministries/ Departments by, or under the general or special directions of, the Minister-in-charge subject to requisite inter-Departmental consultations stipulated in the ToB Rules. Further, the ToB Rules specify the cases for which approval of the Prime Minister, the Cabinet and its Committees, and of the President is required. The cases that require approval of Cabinet are indicated in the Second Schedule to the ToB Rules, and those requiring approval of the Committees of the Cabinet are indicated in the First Schedule to the ToB Rules. The cases that require submission to the Prime Minister and the President are listed in the Third Schedule to the ToB Rules. Accordingly, while a significant portion of the Government business gets disposed of at the departmental level, certain cases, or class of cases that are important from the national perspective, require approval of the Cabinet or one of the Committees of the Cabinet.',
        content_type: 'text',
        display_order: 3
      },
      {
        section_key: 'support_cabinet_committees',
        title: 'Support to Cabinet Committees',
        content: 'The secretarial assistance, provided by the Cabinet Secretariat to the Cabinet and Cabinet committees, includes:\n\nConvening of the meetings of the Cabinet & its Committees on the orders of the Prime Minister.\nPreparation and circulation of the agenda and papers related to the cases on the agenda.\nPreparation of record of discussions.\nCirculation of the record of discussions after obtaining the approval of the Prime Minister.\nMonitoring implementation of decisions taken by the Cabinet and its Committees.\n\nThe Cabinet Secretariat is the custodian of the papers of the Cabinet meetings.',
        content_type: 'text',
        display_order: 4
      },
      {
        section_key: 'inter_ministerial_coordination',
        title: 'Promotion of Inter-Ministerial Coordination',
        content: 'Among the inter-Ministerial matters, the coordination is required for:\n\nRemoving difficulties.\nRemoving differences.\nOvercoming delays.\nCoordination in administrative action.\nCoordination of policies.\n\nWhile each Ministry is responsible for acting on its own for expeditious implementation of Government policies, plans and programmes, where inter-Ministerial cooperation is involved, they often seek the assistance of the Cabinet Secretariat. The inter-Ministerial problems are dealt with in the meetings of the Committees of Secretaries (COS). Committees are constituted for discussing specific matters and proposals emanating from various Secretaries to the Government and meetings are held under the chairmanship of the Cabinet Secretary. These committees have been able to break bottlenecks or secure mutually supporting inter-Ministerial action.\n\nThe discussions of the COS take place on the basis of a paper formulated by the principal Department concerned and the Department with a different point of view, if any, providing a supplementary note. The decisions or recommendations of the COS are unanimous. These proceedings are also circulated to and are followed up by the Departments. There are other important functions which it discharges, viz.\n\nMonitoring.\nCoordination.\nPromoting new policy initiatives.\n\nThe Cabinet Secretariat is seen as a useful mechanism by the Departments for promoting inter-Ministerial coordination since the Cabinet Secretary is also the head of the civil services. Ministries/ Departments through the system of monthly DO letters apprise the Cabinet Secretary about the following:\n\nPolicy and other matters pending due to prolonged inter-ministerial consultations;\nProposals / references pending for long;\nParticulars of any case in which there has been a departure from Rules of Business; and\nImportant matters / significant development(s).',
        content_type: 'text',
        display_order: 5
      },
      {
        section_key: 'objectives',
        title: 'Objectives',
        content: 'Before the adoption of the portfolio system in the Government of India, all Governmental business was disposed of by the Governor-General in Council, the Council functioning as a Joint Consultative Board. As the scale and complexity of business of the Government increased, the work of the various Departments was distributed amongst the members of the Council, only the more important cases being dealt with by the Governor-General or the Council collectively.\n\nThis procedure was legalized by the Indian Councils Act, 1861 during the time of Lord Canning, leading to the introduction of the portfolio system and the inception of the Executive Council of the Governor-General. The Secretariat of the Executive Council was headed by the Private Secretary to the Viceroy, but he did not attend the Council meetings. Lord Willingdon first started the practice of having his Private Secretary by his side at these meetings. Later, this practice continued and in November, 1935, the Viceroy\'s Private Secretary was given the additional designation of Secretary to the Executive Council. But these posts were separated subsequently, and a separate Secretary was appointed to the Executive Council as distinct from the Private Secretary to the Viceroy and Governor General.\n\nConstitution of the Interim Government in September 1946 brought a change in the name of this Office. On 5th September, 1946, the Secretariat of the Executive Council was designated as Cabinet Secretariat, and the Secretary to the Executive Council as Cabinet Secretary. It seems, however, at least in retrospect, that Independence brought a sort of change in the functions of the Cabinet Secretariat. It no longer remained concerned with only the work of circulating papers to Ministers and Ministries, but developed into an organization for effecting coordination between the Ministries.',
        content_type: 'text',
        display_order: 6
      },
      {
        section_key: 'development',
        title: 'Development',
        content: 'After independence, in 1949, an Economic Committee of the Cabinet was set up with its Secretariat at Ministry of Finance. In 1950, this was transferred to Cabinet Secretariat and designated as Economic Wing and ultimately merged with the Secretariat in 1955. In 1954, the Organisation and Methods Division was established under the Cabinet Secretariat which was later transferred to Ministry of Home Affairs during 1964. Presently, it is under Department of Administrative Reforms and Public Grievances.\n\nOn 1st October, 1947, the Defence Committee of the Cabinet was constituted. To assist the Cabinet Secretary in servicing the Defence Committee of the Cabinet, a Military Wing was established in the Cabinet Secretariat in October, 1947 itself. In 1970, the CCPA replaced the Defence Committee of the Cabinet and Internal Affairs Committee of the Cabinet. Secretarial assistance to the CCPA was provided by the Civil wing of the Cabinet Secretariat and the Military Wing of the Cabinet was providing assistance for Defence Minister\'s Committees, Chiefs of Staff Committees etc. As the Military Wing was not connected with any work within the Cabinet Secretariat and functionally linked to the Ministry of Defence, the Military Wing was transferred to the Ministry of Defence with effect from 1st July, 1991.\n\nDepartment of Statistics was created in April, 1961 under Cabinet Secretariat and transferred to Ministry of Planning in February, 1973. It was converted into a Ministry in October, 1999.\n\nDepartment of Special Economic Coordination was set up under Cabinet Secretariat in June, 1962, which was placed as Department of Co-ordination under newly created Ministry of Economic and Defence Co-ordination in November, 1962. Its work was transferred to Department of Co-ordination under Ministry of Finance on 11th September, 1963, and since 14th June, 1967, this department ceased to exist. Its work was transferred to Department of Economic Affairs under Ministry of Finance.\n\nAn Intelligence Wing was set up to provide secretarial assistance to the Joint Intelligence Committee in 1965.\n\nThe Bureau of Public Enterprises was brought under the Cabinet Secretariat for short duration from January, 1966 to June, 1966 and transferred to Department of Co-ordination under Ministry of Finance on 6th June, 1966. On 14th June, 1967, it was transferred to Department of Expenditure under Ministry of Finance. On 25th September, 1985, it was converted into a separate Department of Public Enterprises under Ministry of Industry, which was placed under Ministry of Heavy Industries and Public Enterprises on 15th October, 1999. Since 6th July, 2021, this department is under Ministry of Finance.',
        content_type: 'text',
        display_order: 7
      },
      {
        section_key: 'development_history',
        title: 'In June, 1970 three departments namely:',
        content: 'Department of Electronics\nDepartment of Scientific and Industrial Research and\nDepartment of Personnel\n\nwere created under Cabinet Secretariat and in July, 1970, Directorate General of Revenue Intelligence-cum-Directorate of Enforcement was set up under Department of Cabinet Affairs under Cabinet Secretariat and later this directorate was shifted to Department of Personnel in August, 1970.\n\nDepartment of Scientific and Industrial Research became independent department in May, 1971 and renamed as Department of Science and Technology. Since 4th January, 1985, it is under Ministry of Science and Technology with its initial nomenclature.\n\nThe Department of Electronics became independent department in 1971 and the Department of Personnel was renamed as D/o Personnel and Administrative Reforms on 07.02.1973. Department of Personnel and Administrative Reforms was transferred to the Ministry of Home Affairs from the Cabinet Secretariat in 1977. At present, it is a part of the Ministry of Personnel, Public Grievances and Pensions with a bifurcation as Department of Personnel and training and Department of Administrative Reforms and Public Grievances.\n\nDepartment of Ocean Development was created in July 1981 under Cabinet Secretariat and became independent department in February, 1982. It became a Ministry in February, 2006, and since July, 2006, its functions are being handled by Ministry of Earth Sciences.',
        content_type: 'text',
        display_order: 8
      },
      {
        section_key: 'dpg',
        title: 'Directorate Of Public Grievances (DPG)',
        content: 'The Directorate of Public Grievances was set up in the Cabinet Secretariat in March, 1988. Grievances can be filed either online or through post/drop-box with the Directorate of Public Grievance in respect of select Ministries/Departments/Organizations which have extensive public interface such as MTNL/BSNL, Railways, Posts, Insurance Companies, Public Sector Banks etc. (list is available at https://dpg.gov.in/Authpages/OgCovered.aspx).\n\nDepending on nature and gravity of the grievances, the Directorate either seeks comments or transfers the same for appropriate action to the concerned Department(s).',
        content_type: 'text',
        display_order: 9
      },
      {
        section_key: 'nacwc',
        title: 'National Authority Chemical Weapons Convention (NACWC)',
        content: 'The National Authority Chemical Weapons Convention was set up to fulfill India\'s obligations under the Chemical Weapons Convention (CWC). The CWC is a multilateral international treaty on the prohibition of development, production, stockpiling and use of Chemical Weapons. The Convention came into force on 29th April, 1997. As on 31st March, 2025, 193 States Parties (countries) have ratified or acceded to the treaty. The Organization for the Prohibition of Chemical Weapons (the OPCW), the implementing body for the Convention is based at the Hague, the Netherlands. The OPCW was awarded Nobel Peace Prize in 2013, in recognition of its efforts towards the global elimination of Chemical Weapons.\n\nThe National Authority Chemical Weapons Convention was constituted by the Cabinet Secretariat on 5th May, 1997. The Chemical Weapons Convention Act, 2000 (the Act), was enacted and came into force on 1st July, 2005. The Authority was established and notified under the CWC Act, 2000 on 13th June 2005.\n\nThe National Authority is headed by the Chairperson who shall have a rank equivalent to that of a Secretary to the Government of India and is supported by a suitable Technical Secretariat to look after its various functions. A high level Steering Committee under the chairmanship of the Cabinet Secretary with Home Secretary, Foreign Secretary, Secretary, Ministry of Defence, Secretary, Department of Revenue, Secretary, Department of Chemicals & Petrochemicals, Secretary, Department of Defence Research & Development and Secretary, Department of Commerce is established to oversee the functions of the Authority and exercise and perform powers of the Central Government, in accordance with the provisions of the aforesaid Act.\n\nThe National Authority is responsible for implementation of the CWC Act, liaison with OPCW and other States Parties (countries) to the Convention, fulfilling India\'s treaty obligations including timely submission of declarations, co-ordinating OPCW inspections, etc.',
        content_type: 'text',
        display_order: 10
      },
      {
        section_key: 'dbt_mission',
        title: 'Direct Benefit Transfer(DBT) Mission',
        content: 'DBT is a major reform initiative where benefits, cash or in kind, are delivered directly to targeted beneficiaries using Aadhaar. It envisages efficiency and inclusion in the delivery processes leading to greater accountability and transparency in the system.\n\nDBT Mission was created in the Planning Commission to act as a nodal point for implementation of DBT. The Mission was transferred to the Department of Expenditure in July 13 and shifted to Cabinet Secretariat w.e.f. 14.09.2015.',
        content_type: 'text',
        display_order: 11
      },
      {
        section_key: 'psa_office',
        title: 'Office of the Principal Scientific Adviser (O/o PSA)',
        content: 'The Office of the Principal Scientific Adviser to the Government of India (O/o of PSA) was set-up in November, 1999 primarily to:\n\nEvolve polices, strategies and missions for the generation of innovations and support systems for multiple applications,\nGenerate science and technology tasks in critical infrastructure, economic and social sectors in partnership with Government departments, institutions and industry,\n\nOffice of PSA also services the Prime Minister\'s Science, Technology and Innovation Advisory Council (PM-STIAC).\n\nFrom August, 2018, Office of PSA has been placed administratively under the Cabinet Secretariat.',
        content_type: 'text',
        display_order: 12
      },
      {
        section_key: 'cabinet_secretaries',
        title: 'Cabinet Secretaries',
        content: '',
        content_type: 'download',
        display_order: 13,
        file_url: '#',
        file_size: '0 KB'
      },
      {
        section_key: 'work_distribution',
        title: 'Work Distribution',
        content: '',
        content_type: 'download',
        display_order: 14,
        file_url: '#',
        file_size: '119.47 KB'
      },
      {
        section_key: 'organization_chart',
        title: 'Organization Chart',
        content: '',
        content_type: 'download',
        display_order: 15,
        file_url: '#',
        file_size: '141.00 KB'
      }
    ];

    try {
      for (const item of defaultContent) {
        await fetch('/api/admin/about', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item)
        });
      }
      alert('Default content initialized successfully!');
      await load();
    } catch (e) {
      alert('Failed to initialize default content');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">About Page Content</h1>
            <p className="text-gray-600 mt-1">Manage About page content sections</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={initializeDefaultContent}
              className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              title="Initialize default content from current About page"
            >
              <span aria-hidden="true" className="material-symbols-outlined mr-2">refresh</span>
              Initialize Default
            </button>
            <button
              onClick={() => { setShowForm(true); setEditing(null); }}
              className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 shadow cursor-pointer"
              aria-label="Add content"
              title="Add content"
            >
              <span aria-hidden="true" className="material-symbols-outlined">add</span>
            </button>
          </div>
        </div>

        {/* Loading / Error */}
        {(loading || error) && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            {loading && <SkeletonTable rows={5} cols={6} />}
            {error && <p className="text-red-600 mt-1">{error}</p>}
          </div>
        )}

        {/* Content Form */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4">{editing ? 'Edit Content' : 'Add Content'}</h2>
            <AboutContentForm
              initial={editing}
              onCancel={() => { setShowForm(false); setEditing(null); }}
              onSaved={onSaved}
            />
          </div>
        )}

        {/* Content table */}
        {!loading && !showForm && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Content Sections</h2>
              <span className="text-sm text-gray-500">Total: {items.length}</span>
            </div>
            <div className="overflow-x-auto">
              <table id="about-content-table" className="min-w-full divide-y divide-gray-200 table-fixed">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Section Key</th>
                    {/* <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th> */}
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Active</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">File Info</th>
                    <th className="px-4 py-2 w-28"></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {items.map((r) => (
                    <tr key={r.id}>
                      <td className="px-4 py-2 text-sm text-gray-700 overflow-hidden text-ellipsis whitespace-nowrap" title={r.section_key}>{r.section_key}</td>
                      {/* <td className="px-4 py-2 text-sm text-gray-700 overflow-hidden text-ellipsis whitespace-nowrap" title={r.title}>{r.title || '-'}</td> */}
                      <td className="px-4 py-2 text-sm text-gray-700 whitespace-nowrap">{r.content_type}</td>
                      <td className="px-4 py-2 text-sm text-gray-700 whitespace-nowrap">{r.is_active ? 'Yes' : 'No'}</td>
                      <td className="px-4 py-2 text-sm text-gray-700 whitespace-nowrap">{r.display_order}</td>
                      <td className="px-4 py-2 text-sm text-gray-700 whitespace-nowrap">
                        {r.file_name ? (
                          <div className="flex items-center gap-1">
                            <span className="text-blue-600">📄</span>
                            <span className="text-blue-600 max-w-[120px] overflow-hidden text-ellipsis whitespace-nowrap" title={r.file_name}>{r.file_name}</span>
                            {r.file_size && <span className="text-gray-500 text-xs">({r.file_size})</span>}
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-2 text-sm text-right space-x-2 w-28 whitespace-nowrap">
                        <button
                          onClick={() => { setEditing(r); setShowForm(true); }}
                          className="inline-flex items-center justify-center w-9 h-9 rounded-full border hover:bg-gray-50 cursor-pointer"
                          aria-label="Edit"
                          title="Edit"
                        >
                          <span aria-hidden="true" className="material-symbols-outlined">edit</span>
                        </button>
                        <button
                          onClick={() => onDelete(r.id)}
                          className="inline-flex items-center justify-center w-9 h-9 rounded-full border text-red-600 hover:bg-red-50 cursor-pointer"
                          aria-label="Delete"
                          title="Delete"
                        >
                          <span aria-hidden="true" className="material-symbols-outlined">delete</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

function AboutContentForm({ initial, onCancel, onSaved }) {
  const [form, setForm] = useState({
    section_key: initial?.section_key || '',
    title: initial?.title || '',
    content: initial?.content || '',
    content_type: initial?.content_type || 'text',
    display_order: typeof initial?.display_order === 'number' ? initial.display_order : '',
    is_active: initial?.is_active ?? true,
    file_url: initial?.file_url || '',
    file_size: initial?.file_size || '',
    file_name: initial?.file_name || '',
  });
  const [saving, setSaving] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const url = initial ? `/api/admin/about/${initial.id}` : '/api/admin/about';
      const method = initial ? 'PUT' : 'POST';
      
      // Use FormData for file upload
      const formData = new FormData();
      formData.append('section_key', form.section_key);
      formData.append('title', form.title);
      formData.append('content', form.content);
      formData.append('content_type', form.content_type);
      formData.append('display_order', form.display_order);
      formData.append('is_active', form.is_active);
      formData.append('file_url', form.file_url);
      formData.append('file_size', form.file_size);
      formData.append('file_name', form.file_name);
      
      if (selectedFile) {
        formData.append('file', selectedFile);
      }
      
      const res = await fetch(url, {
        method,
        body: formData,
      });
      if (!res.ok) throw new Error('Save failed');
      onSaved && onSaved();
    } catch (e) {
      alert(e.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Section Key *</label>
          <input 
            type="text" 
            value={form.section_key} 
            onChange={(e) => setForm({ ...form, section_key: e.target.value })} 
            required 
            placeholder="e.g., vision, functions, objectives"
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
          />
          <p className="text-xs text-gray-500 mt-1">Unique identifier for this section (no spaces, use underscores)</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Title</label>
          <input 
            type="text" 
            value={form.title} 
            onChange={(e) => setForm({ ...form, title: e.target.value })} 
            placeholder="Section title displayed on page"
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Content Type</label>
          <select 
            value={form.content_type} 
            onChange={(e) => setForm({ ...form, content_type: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="text">Text</option>
            <option value="html">HTML</option>
            <option value="list">List</option>
            <option value="download">Download</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Display Order</label>
          <input 
            type="number" 
            value={form.display_order} 
            onChange={(e) => setForm({ ...form, display_order: e.target.value })} 
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
          />
        </div>
        {form.content_type === 'download' && (
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Upload File</label>
            <input 
              type="file" 
              onChange={(e) => setSelectedFile(e.target.files[0])}
              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
            />
            <p className="text-xs text-gray-500 mt-1">Upload PDF, DOC, XLS, PPT files. File size and URL will be calculated automatically.</p>
            {form.file_name && (
              <p className="text-sm text-gray-600 mt-2 flex items-center gap-1">
                Current file: <span className="font-medium max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap" title={form.file_name}>{form.file_name}</span> <span className="text-xs text-gray-400">({form.file_size})</span>
              </p>
            )}
          </div>
        )}
        {form.content_type !== 'download' && (
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Content</label>
            <textarea 
              rows={8} 
              value={form.content} 
              onChange={(e) => setForm({ ...form, content: e.target.value })} 
              placeholder="Content for this section. Use \\n for line breaks."
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
            />
            <p className="text-xs text-gray-500 mt-1">For paragraphs, use \\n for line breaks. For HTML type, you can use HTML tags.</p>
          </div>
        )}
        <div className="md:col-span-2 flex items-center">
          <input 
            id="is_active" 
            type="checkbox" 
            checked={form.is_active} 
            onChange={(e) => setForm({ ...form, is_active: e.target.checked })} 
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" 
          />
          <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">Active</label>
        </div>
      </div>
      <div className="flex justify-end gap-3">
        <button 
          type="button" 
          onClick={onCancel} 
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Cancel
        </button>
        <button 
          type="submit" 
          disabled={saving} 
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60"
        >
          {saving ? 'Saving...' : initial ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  );
}
