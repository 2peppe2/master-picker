import { describe, expect, it } from "vitest";
import {
  buildTimeEditSemesterIcsUrl,
  parseTimeEditCourseOccasions,
  selectOccasionsForSemester,
} from "@/lib/timeEdit";

const searchObject = (id: string, name: string) =>
  `<div id="objectbasketitemX0" data-id="${id}" data-idonly="${id.split(".")[0]}" data-type="219" data-name="${name}" data-relto="0" tabindex="0" role="button" class="clickable2 searchObject    " >`;

describe("TimeEdit course occasions", () => {
  it("reads the week range TimeEdit encodes in the object name", () => {
    const html = searchObject(
      "946285.219",
      "TDDD38, Avancerad programmering i C++, TDDD38 2636-2702 ",
    );

    expect(parseTimeEditCourseOccasions(html, "TDDD38")).toEqual([
      { objectId: "946285.219", start: "20260831", end: "20270117" },
    ]);
  });

  it("ignores objects for a different course", () => {
    const html = searchObject(
      "946286.219",
      "TDDD38HT, Something else, TDDD38HT 2636-2702 ",
    );

    expect(parseTimeEditCourseOccasions(html, "TDDD38")).toEqual([]);
  });

  it("picks the autumn occasion over last spring's", () => {
    const occasions = parseTimeEditCourseOccasions(
      searchObject(
        "945612.219",
        "TDDD38, Avancerad programmering i C++, TDDD38 2604-2623 ",
      ) +
        searchObject(
          "946285.219",
          "TDDD38, Avancerad programmering i C++, TDDD38 2636-2702 ",
        ),
      "TDDD38",
    );

    expect(
      selectOccasionsForSemester(occasions, { semester: "HT", year: 2026 }),
    ).toEqual(["946285.219"]);
    expect(
      selectOccasionsForSemester(occasions, { semester: "VT", year: 2026 }),
    ).toEqual(["945612.219"]);
  });

  it("keeps one object per week range so programme variants are not duplicated", () => {
    const occasions = parseTimeEditCourseOccasions(
      searchObject("946198.219", "TATA24, Linjär algebra, TATA24 2636-2702 _frist1:1,2:4") +
        searchObject(
          "946907.219",
          "TATA24, Linjär algebra, TATA24 2636-2702 _MAT1prgk.1:1,2:4",
        ) +
        searchObject("946908.219", "TATA24, Linjär algebra, TATA24 2645-2702 _prgk.1:4,2:4"),
      "TATA24",
    );

    expect(
      selectOccasionsForSemester(occasions, { semester: "HT", year: 2026 }),
    ).toEqual(["946198.219", "946908.219"]);
  });

  it("picks the study period's occasion when a course runs as two", () => {
    // TEAE01 is scheduled in period 1 block 2 and period 2 block 2, and
    // TimeEdit keeps a separate object for each half.
    const occasions = parseTimeEditCourseOccasions(
      searchObject(
        "946270.219",
        "TEAE01, Industriell ekonomi, grundkurs, TEAE01 2636-2644 ",
      ) +
        searchObject(
          "946269.219",
          "TEAE01, Industriell ekonomi, grundkurs, TEAE01 2645-2702 ",
        ),
      "TEAE01",
    );
    const autumn = { semester: "HT", year: 2026 } as const;

    expect(selectOccasionsForSemester(occasions, autumn, [1])).toEqual([
      "946270.219",
    ]);
    expect(selectOccasionsForSemester(occasions, autumn, [2])).toEqual([
      "946269.219",
    ]);
    expect(selectOccasionsForSemester(occasions, autumn, [1, 2])).toEqual([
      "946270.219",
      "946269.219",
    ]);
    // Without a period, the whole semester still resolves to both halves.
    expect(selectOccasionsForSemester(occasions, autumn)).toEqual([
      "946270.219",
      "946269.219",
    ]);
  });

  it("keeps a semester-long occasion no matter which period it sits in", () => {
    const occasions = parseTimeEditCourseOccasions(
      searchObject(
        "946285.219",
        "TDDD38, Avancerad programmering i C++, TDDD38 2636-2702 ",
      ),
      "TDDD38",
    );

    for (const periods of [[1], [2], [1, 2]]) {
      expect(
        selectOccasionsForSemester(
          occasions,
          { semester: "HT", year: 2026 },
          periods,
        ),
      ).toEqual(["946285.219"]);
    }
  });

  it("drops occasions whose name carries no week range", () => {
    const occasions = parseTimeEditCourseOccasions(
      searchObject("945000.219", "TDDD38, Avancerad programmering i C++"),
      "TDDD38",
    );

    expect(
      selectOccasionsForSemester(occasions, { semester: "HT", year: 2026 }),
    ).toEqual([]);
  });

  it("spans both study periods of the semester in the feed url", () => {
    expect(
      buildTimeEditSemesterIcsUrl({
        objectIds: ["946285.219"],
        semester: "HT",
        year: 2026,
      }),
    ).toContain("p=20260831.x%2C20270117.x");
  });
});
