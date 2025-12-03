/**
 * @file filterCtaMessages.ts
 */

import type { ICtaFilterProps, ICtaMessage } from "@/interfaces/cta";

/**
 * Determine if a message should be used based on filterProps.
 *
 * @param filterProps - Properties to compare to for filter targeting.
 */
export const filterCtaMessages =
  (filterProps?: ICtaFilterProps) => (message: ICtaMessage) => {
    const { targetContent, targetCategories, targetPrograms } = message;
    const isTargeted = targetContent || targetCategories || targetPrograms;
    let contentMatched = false;
    let categoriesMatched = false;
    let programsMatched = false;

    // Always use messages that are not target.
    if (!isTargeted) return true;

    // Check Content Targets.
    if (targetContent?.length) {
      contentMatched =
        !!filterProps?.id &&
        targetContent.map((item) => item.id).includes(filterProps.id);
    }

    // Check Category Targets.
    if (targetCategories?.length) {
      const filterPropsCategories = [
        ...new Set([...(filterProps?.categories || [])]),
      ];
      const targetCategoriesUnique = [
        ...new Set([...targetCategories.map((item) => item.id)]),
      ];
      const combinedCategories = new Set([
        ...targetCategoriesUnique,
        ...filterPropsCategories,
      ]);

      categoriesMatched =
        [...combinedCategories].length === filterPropsCategories.length;
    }

    // Check Program Target.
    if (targetPrograms) {
      const filterPropsPrograms = [
        ...new Set([...(filterProps?.programs || [])]),
      ];
      const targetProgramsUnique = [
        ...new Set([...targetPrograms.map((item) => item.id)]),
      ];
      const combinedPrograms = new Set([
        ...targetProgramsUnique,
        ...filterPropsPrograms,
      ]);

      programsMatched = [...combinedPrograms].length === targetPrograms.length;
    }

    // Use message if any of the targeting matched.
    return contentMatched || categoriesMatched || programsMatched;
  };
