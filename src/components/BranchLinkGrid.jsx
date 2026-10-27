import { Link } from 'react-router-dom';
import { areaCabang, branches, ruteCabang } from '../data/branches';
import BranchStatus from './BranchStatus';
import { ArrowRightIcon } from './Icons';

/**
 * Deretan kartu yang masing-masing menuju halaman satu cabang.
 *
 * Selain memudahkan pengunjung, tautan-tautan inilah yang membuat halaman tiap
 * cabang ditemukan perayap dari beranda, dan teks tautannya (nama kawasan)
 * memberi tahu mesin pencari halaman itu tentang apa.
 *
 * `excludeId` dipakai di halaman cabang supaya cabang yang sedang dibuka tidak
 * ikut ditawarkan lagi.
 */
export default function BranchLinkGrid({ excludeId }) {
  return (
    <ul className="area-grid">
      {branches
        .filter((branch) => branch.id !== excludeId)
        .map((branch) => (
          <li key={branch.id}>
            <Link to={ruteCabang(branch)} className="area-card">
              <h3>Vitasari {areaCabang(branch)}</h3>
              <p>{branch.address}</p>
              <span className="area-card__hours">{branch.hours}</span>
              <BranchStatus hours={branch.hours} />
              <ArrowRightIcon width={14} height={14} className="area-card__arrow" />
            </Link>
          </li>
        ))}
    </ul>
  );
}
