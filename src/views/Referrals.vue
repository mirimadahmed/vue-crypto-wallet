<template>
  <div class="referrals py-5">
    <div class="row p-0 mx-0 my-5">
      <div class="col-8 m-auto p-5 bg-light mt-5">
        <h2>Referr Sardis to your friends, You both earn 10% on their first purchase.</h2>
        <b-table hover :items="items"></b-table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      items: [
        {
          referral_bonus: 40,
          username: "Dickerson",
          date_time: "10th January 2021 18:00",
        },
        {
          referral_bonus: 21,
          username: "Larsen",
          date_time: "20th January 2021 10:00",
        },
        {
          referral_bonus: 89,
          username: "Geneva",
          date_time: "22nd January 2021 11:00",
        },
        {
          referral_bonus: 38,
          username: "Jami",
          date_time: "3rd January 2021 15:00",
        },
      ],
    };
  },
};
</script>