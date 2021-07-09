const NUCLEOTIDE_COMPLIMENTS = {
  A: 'T',
  T: 'A',
  C: 'G',
  G: 'C',
};

const complement = (nuc: string): string => {
  if (Object.keys(NUCLEOTIDE_COMPLIMENTS).includes(nuc)) {
    // @ts-ignore
    return NUCLEOTIDE_COMPLIMENTS[nuc];
  }
  return '';
};

/**
 * Get reference and mutated nucleotide taking orientation into consideration.
 * @param orientation
 * @param original_nucleotide
 * @param replacement_nucleotide
 * @returns {{ref: *, alt: *}}
 */
export const getRefAlt = ({
  orientation,
  original_nucleotide,
  replacement_nucleotide,
}: {
  orientation: string;
  original_nucleotide: string;
  replacement_nucleotide: string;
}) => {
  let ref, alt;
  if (orientation === '-') {
    ref = complement(original_nucleotide);
    alt = complement(replacement_nucleotide);
  } else {
    ref = original_nucleotide;
    alt = replacement_nucleotide;
  }
  return { ref, alt };
};

export const hasBayesDelScore = ({
  original_nucleotide,
  replacement_nucleotide,
}: {
  original_nucleotide: string;
  replacement_nucleotide: string;
}): boolean => {
  const ref = original_nucleotide;
  const alt = replacement_nucleotide;
  return !!(ref && alt && ref.length === 1 && alt.length === 1 && complement(ref) && complement(alt));
};
