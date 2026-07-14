<template>
  <v-container>
    <div class="my-2">
      <router-link to="" @click="router.back()"> <v-icon>mdi-arrow-left</v-icon> Back </router-link>
    </div>

    <h2>How does a driver mathematically clinch a spot in the Chase?</h2>

    <p>
      The most points a NASCAR national series driver can earn in a race is 76, by winning both
      stages (10 points each), winning the race (55), and earning the fastest lap point (1). That
      means a driver can clinch a spot in the Chase if their gap to the cutline is at least 76
      points times the number of races remaining before the Chase&mdash;for example, if there are 5
      regular season races remaining, a driver can clinch by reaching at least +380 points to the
      cutline.
    </p>

    <p>
      However, that is not the only way to mathematically clinch a spot. Only one driver can win
      each race, so the maximum number of points two drivers can earn together per race is less than
      76 &times; 2 = 152 points. If one driver sweeps the stages, the race, and the fastest lap, the
      next highest driver can only earn 53 points by getting 2nd in both stages (9 points each) and
      the race (35 points). This means that two drivers combined can only earn a maximum of 76 + 53
      = 129 points in a race. (It doesn't need to be split exactly into 76 + 53; for example, if one
      driver wins the race and the other wins both stages and earns the fastest lap point, that
      works out to 73 + 56 to keep the total at 129.)
    </p>

    <p>
      Imagine you're in 15th place in the Cup standings going into the regular season finale, and
      both 16th and 17th are 70 points behind you. If you DNF and score 1 point (or score 0 by
      missing the race or getting disqualified), either of those drivers could overtake you in the
      standings by winning the race and earning at least 16 stage/fastest lap points. But,
      crucially, they cannot <i>both</i> overtake you because it's impossible for both of them to
      earn 70 points; therefore, you're guaranteed to make the Chase even without scoring a point in
      the final race. This can be quantified by saying your combined gap over your two lowest
      competitors is +140, which is more than the +129 maximum combined points they can score,
      meaning you have already clinched your spot in the Chase.
    </p>

    <p>
      This logic extends to more than just the top two. Three drivers can earn up to 179 points per
      race, four drivers can earn up to 226, and so on. Here's the maximum points N drivers can earn
      in a race, up to 16:
    </p>

    <div class="d-flex justify-center">
      <v-data-table
        density="compact"
        items-per-page="-1"
        hide-default-footer
        style="max-width: 550px"
        :headers="[
          { title: 'N', value: 'drivers' },
          { title: 'Max Points for Nth', value: 'pointsForNth' },
          { title: 'Max Total Points for N Drivers', value: 'maxPoints' },
        ]"
        :items="maxPointsTable"
      />
    </div>

    <p>
      As a real-world example, NASCAR announced that Justin Allgaier was locked into the 2026
      O'Reilly Auto Parts Series Chase with 7 races still to go in the regular season. Here's what
      the standings looked like at that time (according to
      <a href="https://www.racing-reference.info/race-results/2026_MillerTech_Battery_250/B"
        >racing-reference.info</a
      >):
    </p>

    <div class="d-flex justify-center">
      <v-data-table
        density="compact"
        items-per-page="-1"
        hide-default-footer
        style="max-width: 550px"
        :headers="[
          { title: 'Pos', value: 'position' },
          { title: 'Driver', value: 'driver' },
          { title: 'Points', value: 'points' },
          { title: 'Gap to 1st', value: 'gap' },
        ]"
        :row-props="(row) => (row.item.position === 12 ? { class: 'playoff-cutoff-upcoming' } : {})"
        :items="[
          { position: 1, driver: 'Justin Allgaier', points: 842, gap: '–' },
          { position: '...' },
          { position: 10, driver: 'Parker Retzlaff', points: 446, gap: '−396' },
          { position: 11, driver: 'William Sawalich', points: 445, gap: '−397' },
          { position: 12, driver: 'Brent Crews', points: 432, gap: '−410' },
          { position: 13, driver: 'Taylor Gray', points: 429, gap: '−413' },
        ]"
      />
    </div>

    <p>
      To be out of reach for Taylor Gray at this point, Allgaier would've needed to have a gap of 76
      &times; 7 = +532 or higher, which he was still over 100 points short of reaching. But for
      Allgaier to be knocked out of the top 12, he would need to also be passed by Retzlaff,
      Sawalich, and Crews. By referencing the previous table, we find the maximum amount of points
      the four of them could possibly score in 7 races is 226 &times; 7 = 1582. Allgaier's combined
      gap to all four of these drivers comes out to +1616, meaning that it was impossible for all
      four to overtake him, and he had indeed clinched a spot in the Chase with 7 races to go.
    </p>

    <h2>How is the points to clinch number calculated?</h2>

    <p>
      For drivers that aren't yet clinched, there is some amount of points that would clinch them a
      spot if they had that amount today. This depends only on how many points their competitors
      have, so it can be slightly different from driver to driver.
    </p>

    <p>
      The math works like this: start by removing the chosen driver from the standings. This driver
      needs to guarantee that they will beat at least one of the top 16 remaining drivers (or 12, or
      10, depending on the series) in order to clinch a Chase spot. For drivers currently outside of
      the Chase, this is the same as the actual top 16; for drivers inside the Chase, they are
      replaced with the driver in 17th.
    </p>

    <p>
      Now, start by calculating how many points the lowest driver out of these 16 could possibly
      accumulate over the remainder of the regular season. If this is less than the amount of points
      the chosen driver already has, then they are already clinched.
    </p>

    <p>
      If not, then do the same thing with the bottom 2 drivers, and take the lower of the two
      numbers. This can be done by adding together the points that these two drivers had, then
      adding an additional 129 &times; the number of races remaining, and finally dividing by 2.
      This gives a number of points that at least one of the two drivers must be at or below by
      regular season's end. Once again, if this is less than the amount of points the chosen driver
      already has, then they are already clinched. If not, then repeat the process with the bottom 3
      drivers, and so on.
    </p>

    <p>
      By repeating this process with the bottom N drivers from N = 1 all the way up to N = 16 and
      taking whichever result is smallest, a "lowest possible clinch amount" can be found, and the
      "points to clinch" number is the difference between this amount and the number of points the
      driver currently has.
    </p>

    <h2>
      How did a driver clinch without earning the number of points the website said they would need?
    </h2>

    <p>
      Going into a race weekend, the only way a driver can <i>guarantee</i> that they clinch a Chase
      spot in that race is by earning the calculated "points to clinch" or more. But that number
      assumes the worst-case scenario with regards to their competitors' earned points, and usually
      that's not how the race actually plays out. During the average race, the "points to clinch"
      number is likely go down by 10 to 20 points by the time results are official.
    </p>

    <p>
      For example, going into the July 2026 Cup race at Atlanta, Tyler Reddick initially needed to
      hit 777 points to guarantee himself a clinched spot in the Chase. As stage points were handed
      out and some of them went to drivers outside of the 5th-to-17th range in the points standings,
      that number went down first to 774, then 771; after the race results were made official, it
      landed on 762, meaning Reddick's new total of 767 points was enough to clinch a spot. You can
      watch the "earned points" tab throughout the race to see these numbers go down with each stage
      finish.
    </p>
  </v-container>
</template>

<script setup lang="ts">
const router = useRouter();

const maximumPointsForPosition = (position: number) => {
  const basePoints = position === 1 ? 56 : 37 - position; // Including fastest lap point in 1st place points
  const stagePoints = position <= 10 ? 11 - position : 0;
  return basePoints + stagePoints * 2;
};

const maximumPointsForNDrivers = (driver_count: number) => {
  let total = 0;
  for (let i = 0; i < driver_count; i++) {
    total += maximumPointsForPosition(i + 1);
  }
  return total;
};

const maxPointsTable = computed(() => {
  const table: { drivers: number; pointsForNth: number; maxPoints: number }[] = [];
  for (let i = 1; i <= 16; i++) {
    table.push({
      drivers: i,
      pointsForNth: maximumPointsForPosition(i),
      maxPoints: maximumPointsForNDrivers(i),
    });
  }
  return table;
});
</script>

<style scoped>
:deep(.playoff-cutoff-upcoming td) {
  border-bottom: 2px solid #f0cf08 !important;
}
</style>
