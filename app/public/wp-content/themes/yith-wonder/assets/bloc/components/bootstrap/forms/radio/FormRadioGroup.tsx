import { __ } from "@wordpress/i18n";
//@ts-ignore
import { registerBlockType } from "@wordpress/blocks";
//@ts-ignore
import { useBlockProps, InspectorControls } from "@wordpress/block-editor";
//@ts-ignore
import { PanelBody, TextControl, Button, RadioControl } from "@wordpress/components";
registerBlockType("bootstrap/radios", {
  title: __("Grupo de Rádios", "yith-wonder"),
  icon: "image-filter",
  category: "bootstrap_ui",
  attributes: {
    preview: {
      type: "boolean",
      default: false,
    },
    group: {
      type: "array",
      default: [{ label: "Opção 1" }, { label: "Opção 2" }],
    },
  },
  example: {
    attributes: {
      preview: true,
    },
    description: "Preview do Campo de Confirmação",
    innerBlocks: [],
  },
  edit: ({
    attributes,
    setAttributes,
  }: {
    attributes: { preview: boolean; group: { label: string }[] };
    setAttributes: (newAttributes: { group: { label: string }[] }) => void;
  }) => {
    const timestamp = `${new Date().getUTCMilliseconds()}-${new Date().getUTCMinutes()}-${new Date().getUTCHours()}-${new Date().getUTCDay()}-${new Date().getUTCMonth()}-${new Date().getUTCFullYear()}`,
      { preview, group } = attributes,
      updateOptionLabel = (i: number, newLabel: string): void => {
        const options = [...group];
        options[i].label = newLabel;
        setAttributes({ group: options });
        setTimeout(() => {
          const el = document.getElementById(`textControl_${i}`);
          if (!(el instanceof HTMLInputElement)) return;
          console.log(el);
          const cb = (): void => {
            el.focus();
            el.setSelectionRange(el.value.length, el.value.length);
          };
          el.addEventListener("click", cb);
          el.click();
          console.log("clicked");
          el.removeEventListener("click", cb);
        }, 50);
      },
      add = () => setAttributes({ group: [...group, { label: "" }] }),
      //@ts-ignore
      remove = (i: number) => setAttributes({ group: group.toSpliced(i, 1) });
    return preview ? (
      <div>
        <video
          src="http://prossaude-ufrj-test.local/wp-content/uploads/2024/11/form_control.mp4"
          autoPlay
          loop
          playsInline
          muted
          crossOrigin="anonymous"
          className="radioPreview"
          disablePictureInPicture
          style={{
            maxWidth: "100%",
            maxHeight: "100%",
            width: "auto",
            height: "auto",
            objectFit: "contain",
          }}
        ></video>
      </div>
    ) : (
      <>
        <InspectorControls>
          <PanelBody title={__("Grupo de Rádios", "yith-wonder")} initialOpen={true}>
            {group.map((o, i) => (
              <span
                className="radioInspect__Group"
                key={`radio_inspect__${i}__${timestamp}`}
                data-block={`block__${timestamp}`}
              >
                <TextControl
                  id={`textControl_${i}`}
                  className="radioInspect__TextEntry"
                  data-block={`block__${timestamp}`}
                  label={__("Rótulo de Opção", "yith-wonder")}
                  value={o.label}
                  onChange={n => updateOptionLabel(i, n)}
                />
                <Button
                  className="radioInspect_btn radioInspect_btn__remove"
                  data-block={`block__${timestamp}`}
                  isDestructive
                  onClick={() => remove(i)}
                >
                  {__("Remover Opção", "yith-wonder")}
                </Button>
              </span>
            ))}
            <Button
              className="radioInspect_btn radioInspect_btn__add"
              variant="primary"
              data-block={`block__${timestamp}`}
              onClick={add}
            >
              {__("Adicionar Opção", "yith-wonder")}
            </Button>
          </PanelBody>
        </InspectorControls>
        <fieldset
          className="radioGroup__fs"
          data-block={`block__${timestamp}`}
          id={`fs__${timestamp}`}
        >
          {group.map((o, i) => (
            <span
              key={`radioOption_${i}__${timestamp}`}
              id={`radioWrapper__${timestamp}__${o}`}
              className="radioWrapper form-check"
              data-block={`block__${timestamp}`}
            >
              <label
                data-block={`block__${timestamp}`}
                className="radioLabel form-check-label"
                htmlFor={`radio_${i}__${timestamp}`}
                id={`radio_label_${i}__${timestamp}`}
              >
                {o.label || "Sem Rótulo"}
              </label>
              <input
                data-block={`block__${timestamp}`}
                className="blocktypeRadio form-check-input"
                type="radio"
                name={`radio__${timestamp}`}
                id={`radio_${i}__${timestamp}`}
              />
            </span>
          ))}
        </fieldset>
      </>
    );
  },
  save: () => null,
});
