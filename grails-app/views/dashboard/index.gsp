<!DOCTYPE html>
<html>
    <head>
        <meta name="layout" content="dashboard" />

    </head>

    <body>
      <style>
        .global-input {
          @include input($border: 0.5px solid red);
        }
        .cta-button {
          @include button($size: large, $background: pink, $color: white);
        }
      </style>
      <!-- page frame -->
      <div class="grid-frame vertical">
        <!-- header -->
        <div class="dark title-bar" style="height:55px;">
          <span class="title center"><img src="/assets/images/PashionRMPlainWhite.png" width="127px" ></span>
          <span class="left"><img src="/assets/images/lauren.png" height="38px" width="38px" style="margin-right:20px"><a href="#">Login/Register</a></span>
          <span class="right"><a href="#">View</a><a href="#">Dashboard</a></span>
        </div>
        <!-- Main building block -->
        <div id="main_block" class="grid-block">

          <!-- Calendar + Request Small Panel -->
          <div id="CR_S_block" class="shrink grid-block vertical" style="display:flex;">
            <div id="CR_S_calendar_open" class="grid-content" style="width: 300px; border:2px solid red">
              <h6>calendar panel  open</h6>
            </div>
            <div id="CR_S_request_open" class="grid-content" style="width: 300px; border:2px solid lightgrey">
              <h6>request panel open</h6>
            </div>
          </div>

          <!-- Calendar + Request Large Panel -->
          <div id="CR_L_block" class="medium-10 grid-block vertical" style="border:2px solid blue; display: none;">
            <div id="CR_L_block_sub" class="grid-block" style="border:2px solid green">
              <div id="CR_L_block_l_sub" class="grid-block medium-2 vertical" style="border:2px solid orange">
                <div id="CR_L_calendar_panel" class="grid-content shrink" style="border:2px solid pink">
                  <h6>calendar panel</h6>
                </div>
                <div id="CR_L_info_panel" class="grid-content shrink" style="border:2px solid purple">
                  <h6>info panel</h6>
                </div>
              </div>
              <div id="CR_L_data_panel" class="grid-content" style="border:2px solid cyan">
                <h6>data panel</h6>
              </div>
            </div>
          </div>

          <!-- Image Grid Large Panel-->
          <div id="IG_L_panel" class="medium-8 grid-content" style="display:none;">
            <h6>image grid L panel</h6>
          </div>

          <!-- Lightbox Large Panel-->
          <div id="LB_L_panel" class="medium-8 grid-content" style="display:none;">
            <h6>lightbox L panel</h6>
          </div>

          <!-- Image Grid Small + Lightbox Small Panel-->
          <div class="grid-block vertical" style="display:flex">

            <!-- Image Grid Small Panel-->
            <!-- content spec and search -->
            <div id="IG_S_spec_panel" class="grid-block noscroll shrink vertical">
              <form>
                <div class="grid-block">
                  <input id="search_checkbox1" type="checkbox">
                  <input class="global-input" id="search_in" type="text" placeholder="Search">
                  <input id="trending_checkbox" type="checkbox">
                  <label for="trending_checkbox">Trending</label>
                  <input id="latest_checkbox" type="checkbox">
                  <label for="latest_checkbox">Latest </label>
                  <input id="available_checkbox" type="checkbox">
                  <label for="available_checkbox"> Available </label>
                  <input id="start_date" type="text" placeholder="Starting Date">
                  <label for="search_in">to</label>
                  <input id="end_date" type="text" placeholder="Ending M Date">
                </div>
                <div class="grid-content noscroll shrink">
                  <input id="brand_checkbox1" type="checkbox">
                </div>
              </form>
            </div>

            <!-- Image Grid-->
            <div id="IG_S_panel" class="grid-content" style="border:2px solid violet">
              <h6>image grid panel</h6>
              <a href="#" class="cta-button">Buy Now</a>
            </div>

            <!-- Lightbox Small Panel-->
            <div id="LB_S_panel" class="grid-content shrink" style="height:139px; border:2px solid pink">
              <h6>lightbox small panel</h6>
            </div>
          </div>

          <!-- Communications Panel Small -->
          <div class="shrink grid-block">
            <div id="comms_panel" class="grid-content" style="width:300px; border:2px solid yellow; display:flex;">
              <h6>comms panel</h6>
            </div>
          </div>
        </div>

        <!-- footer -->
        <div class="dark title-bar" style="height:35px;">
          <span class="left"><a href="#">Help</a></span>
          <span class="right">(C) 2016 Pashion Ltd</a></span>
        </div>
      </div>
    </body>

</html>
