import { min, padStart } from "lodash";
import { redirect, RedirectType } from "next/navigation";

export function redirectToValidDatedRoute(
  pathPrefix: string,
  params: Partial<Record<"year" | "month" | "day", string>>,
  searchParams?: Record<string, string | string[]>,
) {
  const { year, month, day } = params;
  const monthPadded = month && padStart(month.replace(/^0+/, "0"), 2, "0");
  const dayPadded = day && padStart(day.replace(/^0+/, "0"), 2, "0");
  const now = new Date();
  const nowYear = `${now.getFullYear()}`;
  const valid: typeof params = {
    year,
    month: monthPadded,
    day: dayPadded,
  };

  // Bail if year was not provided.
  if (!year) return;

  // Validate year:
  // - 4 digits
  // - Starts with a 2 (earliest content was created after 2000)
  // - <= to current year
  if (!(/^2\d{3}$/.test(year) && year <= nowYear)) {
    valid.year = nowYear;
  }

  // Validate month:
  // - 2 digits, padded with "0"
  // - 1 through 12
  if (monthPadded && !/^0?\d$|^1[012]$/.test(monthPadded)) {
    // At this point, invalid values will be larger than 12, so cap at current month.
    valid.month = padStart(`${now.getMonth() + 1}`, 2, "0");
  }

  // Validate day:
  // - 2 digits, padded with "0"
  // - 1 through 31
  if (dayPadded && !/^0?\d$|^1\d$|^2\d$|^3[01]$/.test(dayPadded)) {
    // At this point, invalid values will be larger than 31, so cap at current day.
    valid.day = padStart(`${now.getDate()}`, 2, "0");
  }

  // When we have a valid day, ensure it is capped at the last day of the valid month.
  if (valid.day) {
    const date = new Date(`${valid.year}/${valid.month}`);

    date.setMonth(date.getMonth() + 1);
    date.setDate(0);

    const lastDayOfMonth = padStart(`${date.getDate()}`, 2, "0");

    valid.day = min([valid.day, lastDayOfMonth]);
  }

  // Redirect when any of the valid values do not match the original values.
  if (valid.year !== year || valid.month !== month || valid.day !== day) {
    const segments = [valid.year, valid.month, valid.day].filter((v) => !!v);
    const redirectPath = `${pathPrefix.trim() || "/"}/${segments.join("/")}`;
    const url = new URL(redirectPath, "https://theworld.org");

    if (searchParams) {
      Object.entries(searchParams).forEach(([k, v]) => {
        if (Array.isArray(v)) {
          v.forEach((vv) => {
            url.searchParams.append(k, vv);
          });
        } else {
          url.searchParams.append(k, v);
        }
      });
    }

    redirect([url.pathname, url.search].join(""), RedirectType.replace);
  }
}
